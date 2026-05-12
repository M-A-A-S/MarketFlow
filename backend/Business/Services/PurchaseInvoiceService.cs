using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.Product;
using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.DTOs.PurchaseInvoiceItem;
using MarketFlow.Entities;
using MarketFlow.Enums;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace MarketFlow.Business.Services
{
    public class PurchaseInvoiceService : IPurchaseInvoiceService
    {
        private readonly IPurchaseInvoiceRepository _repo;
        private readonly IProductRepository _productRepo;
        private readonly IPurchaseInvoiceItemRepository _purchaseInvoiceItemRepository;

        public PurchaseInvoiceService(IPurchaseInvoiceRepository repo, 
            IProductRepository productRepo,
            IPurchaseInvoiceItemRepository purchaseInvoiceItemRepository)
        {
            _repo = repo;
            _productRepo = productRepo;
            _purchaseInvoiceItemRepository = purchaseInvoiceItemRepository;
        }

        #region Add
        public async Task<Result<PurchaseInvoiceDTO>> AddAsync(PurchaseInvoiceDTO dto)
        {
            // Get products
            var productsResult = await GetProductsAsync(dto.Items);

            if (!productsResult.IsSuccess)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(productsResult.Code, productsResult.StatusCode);
            }

            var productDict = productsResult.Data;

            // Build invoice
            var buildResult = BuildInvoice(dto, productDict);

            if (!buildResult.IsSuccess || buildResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>.Failure(buildResult.Code, buildResult.StatusCode);
            }

            var entity = buildResult.Data;

            entity.InvoiceNumber = GenerateInvoiceNumber();

            // Save invoice
            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess || addResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(addResult.Code, addResult.StatusCode);
            }

            var GetPurchaseInvoiceResult = await _repo.FindByAsync(pi => pi.Id == addResult.Data.Id,
                q => q.Include(pi => pi.Items)
                .ThenInclude(i => i.Product)
                .Include(pi => pi.Payments)
                .Include(pi => pi.Supplier)
                .ThenInclude(s => s.Person));

            return Result<PurchaseInvoiceDTO>.Success(GetPurchaseInvoiceResult?.Data?.ToDTO());
        }
        #endregion

        #region GetById
        public async Task<Result<PurchaseInvoiceDTO>> GetByIdAsync(int id)
        {
            var findByIdResult = await _repo.FindByAsync(x => x.Id == id, q => q.Include(p => p.Items).ThenInclude(i => i.Product).Include(p => p.Payments));

            if (!findByIdResult.IsSuccess || findByIdResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>.Failure(ResultCodes.PurchaseInvoiceItemNotFound, 404);
            }

            return Result<PurchaseInvoiceDTO>.Success(findByIdResult.Data.ToDTO());
        }
        #endregion

        #region GetAll
        public async Task<Result<IEnumerable<PurchaseInvoiceDTO>>> GetAllAsync()
        {
            var findAllResult = await _repo.GetAllAsync();

            if (!findAllResult.IsSuccess || findAllResult.Data == null)
            {
                return Result<IEnumerable<PurchaseInvoiceDTO>>
                    .Failure(findAllResult.Code, findAllResult.StatusCode);
            }

            return Result<IEnumerable<PurchaseInvoiceDTO>>
                .Success(findAllResult.Data.Select(x => x.ToDTO()));

        }

        public async Task<Result<PagedResult<PurchaseInvoiceDTO>>> GetFilteredAsync(PurchaseInvoiceFilterDTO filter)
        {

            var predicate = BuildInvoiceFilterExpression(filter);
            var orderBy = BuildInvoiceOrderByExpression(filter);

            var getPagedResult = await _repo.GetPagedAsync(
                filter: predicate,
                include: q => q
                .Include(i => i.Supplier).ThenInclude(s => s.Person)
                .Include(i => i.Items).ThenInclude(i => i.Product)
                .Include(i => i.Payments),
                orderBy: orderBy,
                pageNumber: filter.PageNumber,
                pageSize: filter.PageSize
               );

            if (!getPagedResult.IsSuccess || getPagedResult.Data == null)
            {
                return Result<PagedResult<PurchaseInvoiceDTO>>.Failure(ResultCodes.PurchaseInvoicesNotFound);
            }

            var result = new PagedResult<PurchaseInvoiceDTO>()
            {
                Items = getPagedResult.Data.Items.Select(i =>
                {
                    var dto = i.ToDTO();
                    return dto;
                }).ToList(),

                Total = getPagedResult.Data.Total,
                PageSize = getPagedResult.Data.PageSize,
                PageNumber = getPagedResult.Data.PageNumber,
            };

            return Result<PagedResult<PurchaseInvoiceDTO>>.Success(result);


        }

        #endregion

        #region Update
        public async Task<Result<PurchaseInvoiceDTO>> UpdateAsync(int id, PurchaseInvoiceDTO dto)
        {
            var findByIdResult = await _repo.FindByAsync(x => x.Id == id, 
                q => q.Include(p => p.Items)
                       .Include(p => p.Payments));

            if (!findByIdResult.IsSuccess || findByIdResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(ResultCodes.PurchaseInvoiceNotFound, 404);
            }

            var entity = findByIdResult.Data;

            var hasPayments = entity.Payments.Any();

            if (hasPayments && dto.Items != null && dto.Items.Any())
            {
                return Result<PurchaseInvoiceDTO>.Failure(
                    ResultCodes.InvoiceHasPaymentsCannotEditItems,
                    400
                );
            }

            // Validate status
            var statusResult = ValidateAndSetStatus(entity, dto.Status);
            if (!statusResult.IsSuccess)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(statusResult.Code, statusResult.StatusCode);
            }

            // Get products

            if (dto.Items == null || !dto.Items.Any())
            {
                return Result<PurchaseInvoiceDTO>.Failure(
                    ResultCodes.InvalidInvoiceItems,
                    400
                );
            }

            var productsResult = await GetProductsAsync(dto.Items);

            if (!productsResult.IsSuccess || productsResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(productsResult.Code, productsResult.StatusCode);
            }

            var productDict = productsResult.Data;

            // Update main fields
            UpdateMainFields(entity, dto, hasPayments);

            // Replace items (DB price)
            if (!hasPayments)
            {
                var replaceItemsResult = await ReplaceItemsAsync(entity, dto.Items, productDict);

                if (!replaceItemsResult.IsSuccess)
                {
                    return Result<PurchaseInvoiceDTO>
                        .Failure(replaceItemsResult.Code, replaceItemsResult.StatusCode);
                }

                // Recalculate totals (server-side only)
                RecalculateTotals(entity, dto);
            }


            if (entity.GetPaidAmount() >= entity.NetTotal)
            {
                entity.Status = PurchaseInvoiceStatus.Approved;
            }
            else if (entity.Payments.Any())
            {
                entity.Status = PurchaseInvoiceStatus.Pending;
            }

            var updateResult = await _repo.UpdateAndSaveAsync(entity);

            if (!updateResult.IsSuccess || updateResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(updateResult.Code, updateResult.StatusCode);
            }

            return Result<PurchaseInvoiceDTO>.Success(updateResult.Data.ToDTO());
        }
        #endregion

        #region Delete
        public async Task<Result<bool>> DeleteAsync(int id)
        {
            return await _repo.DeleteAndSaveAsync(id);
        }
        #endregion

        #region Helper
        private string GenerateInvoiceNumber()
        {
            return $"INV-{DateTime.UtcNow:yyyy}-{Guid.NewGuid().ToString()[..6].ToUpper()}";
        }

        private async Task<Result<Dictionary<int, Product>>> GetProductsAsync(List<PurchaseInvoiceItemDTO> items)
        {
            var productIds = items.Select(i => i.ProductId).Distinct().ToList();

            var result = await _productRepo.GetByIdsAsync(productIds);

            if (!result.IsSuccess || result.Data == null)
                return Result<Dictionary<int, Product>>.Failure(result.Code, result.StatusCode);

            var missingIds = productIds.Except(result.Data.Select(p => p.Id)).ToList();

            if (missingIds.Any())
            {
                return Result<Dictionary<int, Product>>.Failure(
                    $"Missing products: {string.Join(",", missingIds)}",
                    404
                );
            }

            return Result<Dictionary<int, Product>>.Success(
                result.Data.ToDictionary(p => p.Id)
            );
        }

        private Result<PurchaseInvoice> BuildInvoice(
            PurchaseInvoiceDTO dto,
            Dictionary<int, Product> productDict)
        {
            var items = new List<PurchaseInvoiceItem>();
            decimal totalBeforeDiscount = 0;

            foreach (var item in dto.Items)
            {
                if (!productDict.TryGetValue(item.ProductId, out var product))
                {
                    return Result<PurchaseInvoice>.Failure(
                        $"Product {item.ProductId} not found",
                        404
                    );
                }

                var lineTotal = product.Price * item.Quantity;
                totalBeforeDiscount += lineTotal;

                items.Add(new PurchaseInvoiceItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price,
                    //Total = lineTotal
                });
            }

            var payments = new List<PurchasePayment>();

            foreach (var payment in dto.Payments)
            {
                payments.Add(payment.ToEntity());
            }

            var discount = dto.Discount ?? 0;
            var tax = dto.Tax ?? 0;

            var netTotal = totalBeforeDiscount - discount + tax;

            var entity = new PurchaseInvoice
            {
                SupplierId = dto.SupplierId,
                InvoiceDate = dto.InvoiceDate ?? DateTime.UtcNow,
                Discount = discount,
                Tax = tax,
                TotalBeforeDiscount = totalBeforeDiscount,
                NetTotal = netTotal,
                Items = items,
                Payments = payments
            };

            if (dto.Payments.Any())
            {
                entity.Status = PurchaseInvoiceStatus.Pending;
            } else
            {
                entity.Status = PurchaseInvoiceStatus.Draft;
            }

                return Result<PurchaseInvoice>.Success(entity);
        }

        private Result<bool> ValidateAndSetStatus(PurchaseInvoice entity, PurchaseInvoiceStatus newStatus)
        {
            // Cannot modify cancelled
            if (entity.Status == PurchaseInvoiceStatus.Cancelled)
            {
                return Result<bool>.Failure(
                    ResultCodes.InvoiceAlreadyCancelled,
                    400
                );
            }

            // Cannot modify approved (except cancel if you allow it)
            if (entity.Status == PurchaseInvoiceStatus.Approved)
            {
                return Result<bool>.Failure(
                    ResultCodes.InvalidInvoiceStatusForUpdate,
                    400
                );
            }

            // If no change → OK
            if (newStatus == entity.Status)
            {
                return Result<bool>.Success(true);
            }

            // Allowed transitions
            var isValidTransition =
                // Draft → Pending OR Cancelled
                (entity.Status == PurchaseInvoiceStatus.Draft &&
                    (newStatus == PurchaseInvoiceStatus.Pending ||
                     newStatus == PurchaseInvoiceStatus.Cancelled))

                ||

                // Pending → Approved OR Cancelled
                (entity.Status == PurchaseInvoiceStatus.Pending &&
                    (newStatus == PurchaseInvoiceStatus.Approved ||
                     newStatus == PurchaseInvoiceStatus.Cancelled));

            if (!isValidTransition)
            {
                return Result<bool>.Failure(
                    ResultCodes.InvalidStatusTransition,
                    400
                );
            }

            entity.Status = newStatus;

            return Result<bool>.Success(true);
        }

        private void UpdateMainFields(PurchaseInvoice entity, PurchaseInvoiceDTO dto, bool hasPayments)
        {
            entity.InvoiceDate = dto.InvoiceDate ?? entity.InvoiceDate;
            //entity.InvoiceNumber = dto.InvoiceNumber;

            if (!hasPayments)
            {
                entity.SupplierId = dto.SupplierId;
            }
        }

        private async Task<Result<bool>> ReplaceItemsAsync(
            PurchaseInvoice entity,
            List<PurchaseInvoiceItemDTO> items,
            Dictionary<int, Product> productDict)
        {
            // Soft delete old items
            foreach (var oldItem in entity.Items)
            {
                oldItem.IsDeleted = true;
            }

            // Add new items
            var newItems = new List<PurchaseInvoiceItem>();

            foreach (var item in items)
            {
                var product = productDict[item.ProductId];

                newItems.Add(new PurchaseInvoiceItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price,
                    PurchaseInvoiceId = entity.Id,
                    IsDeleted = false
                });
            }

            entity.Items.AddRange(newItems);

            return Result<bool>.Success(true);
        }

        private void RecalculateTotals(PurchaseInvoice entity, PurchaseInvoiceDTO dto)
        {
            var totalBeforeDiscount = entity.Items.Sum(i => i.Quantity * i.UnitPrice);

            var discount = dto.Discount ?? 0;
            var tax = dto.Tax ?? 0;

            entity.TotalBeforeDiscount = totalBeforeDiscount;
            entity.Discount = discount;
            entity.Tax = tax;
            entity.NetTotal = totalBeforeDiscount - discount + tax;
        }


        private Expression<Func<PurchaseInvoice, bool>> BuildInvoiceFilterExpression(PurchaseInvoiceFilterDTO filter)
        {
            return invoice =>
                (string.IsNullOrEmpty(filter.Search) ||
                    invoice.InvoiceNumber.Contains(filter.Search)) &&

                (!filter.SupplierId.HasValue || invoice.SupplierId == filter.SupplierId) &&
                (!filter.Status.HasValue || invoice.Status == filter.Status) &&

                (!filter.FromDate.HasValue || invoice.InvoiceDate >= filter.FromDate) &&
                (!filter.ToDate.HasValue || invoice.InvoiceDate <= filter.ToDate) &&

                (!filter.MinTotal.HasValue || invoice.NetTotal >= filter.MinTotal) &&
                (!filter.MaxTotal.HasValue || invoice.NetTotal <= filter.MaxTotal);
        }

        private Func<IQueryable<PurchaseInvoice>, IOrderedQueryable<PurchaseInvoice>> BuildInvoiceOrderByExpression(PurchaseInvoiceFilterDTO filter)
        {
            return query =>
            {
                return filter.SortBy switch
                {
                    PurchaseInvoiceSortBy.Oldest =>
                        query.OrderBy(i => i.InvoiceDate),

                    PurchaseInvoiceSortBy.TotalLowToHigh =>
                        query.OrderBy(i => i.NetTotal),

                    PurchaseInvoiceSortBy.TotalHighToLow =>
                        query.OrderByDescending(i => i.NetTotal),

                    PurchaseInvoiceSortBy.InvoiceNumber =>
                        query.OrderBy(i => i.InvoiceNumber),

                    _ => query.OrderByDescending(i => i.InvoiceDate) // Newest
                };
            };
        }

        #endregion
    }
}
