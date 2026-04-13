using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.DTOs.PurchaseInvoiceItem;
using MarketFlow.Entities;
using MarketFlow.Enums;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;

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

            return Result<PurchaseInvoiceDTO>.Success(addResult.Data.ToDTO());
        }
        #endregion

        #region GetById
        public async Task<Result<PurchaseInvoiceDTO>> GetByIdAsync(int id)
        {
            var findByIdResult = await _repo.FindByAsync(x => x.Id == id);

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
        #endregion

        #region Update
        public async Task<Result<PurchaseInvoiceDTO>> UpdateAsync(int id, PurchaseInvoiceDTO dto)
        {
            var findByIdResult = await _repo.FindByAsync(x => x.Id == id);

            if (!findByIdResult.IsSuccess || findByIdResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(ResultCodes.PurchaseInvoiceNotFound, 404);
            }

            var entity = findByIdResult.Data;

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
            UpdateMainFields(entity, dto);

            // Replace items (DB price)
            var replaceItemsResult = await ReplaceItemsAsync(entity, dto.Items, productDict);

            if (!replaceItemsResult.IsSuccess)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(replaceItemsResult.Code, replaceItemsResult.StatusCode);
            }

            // Recalculate totals (server-side only)
            RecalculateTotals(entity, dto);

            if (entity.Payments.Any() && entity.Status == PurchaseInvoiceStatus.Draft)
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

        private void UpdateMainFields(PurchaseInvoice entity, PurchaseInvoiceDTO dto)
        {
            entity.InvoiceDate = dto.InvoiceDate ?? entity.InvoiceDate;
            //entity.InvoiceNumber = dto.InvoiceNumber;
            entity.SupplierId = dto.SupplierId;
        }

        private async Task<Result<bool>> ReplaceItemsAsync(
    PurchaseInvoice entity,
    List<PurchaseInvoiceItemDTO> items,
    Dictionary<int, Product> productDict)
        {
            // Delete old items
            var deleteResult = await _purchaseInvoiceItemRepository
                .DeleteRangeAsync(entity.Items);

            if (!deleteResult.IsSuccess)
            {
                return Result<bool>.Failure(
                    deleteResult.Code,
                    deleteResult.StatusCode
                );
            }

            // Rebuild using DB price
            entity.Items = items.Select(x =>
            {
                var product = productDict[x.ProductId];

                return new PurchaseInvoiceItem
                {
                    ProductId = x.ProductId,
                    Quantity = x.Quantity,
                    UnitPrice = product.Price, // from DB
                    PurchaseInvoiceId = entity.Id
                };
            }).ToList();

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

        #endregion
    }
}
