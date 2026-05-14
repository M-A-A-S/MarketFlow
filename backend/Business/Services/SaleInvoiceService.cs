using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess;
using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.DTOs.SaleInvoice;
using MarketFlow.DTOs.SaleInvoiceItem;
using MarketFlow.Entities;
using MarketFlow.Enums;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace MarketFlow.Business.Services
{
    public class SaleInvoiceService : ISaleInvoiceService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SaleInvoiceService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        #region Add
        public async Task<Result<SaleInvoiceDTO>> AddAsync(SaleInvoiceDTO dto)
        {
            var IsRequestValidResult = ValidateRequest(dto);

            if (!IsRequestValidResult.IsSuccess)
            {
                return Result<SaleInvoiceDTO>
                    .Failure(IsRequestValidResult.Code,
                    IsRequestValidResult.StatusCode,
                    IsRequestValidResult.Message);
            }

            var productDictResult = await LoadProductsAsync(dto.Items);
            if (!productDictResult.IsSuccess || productDictResult.Data == null)
            {
                return Result<SaleInvoiceDTO>
                    .Failure(productDictResult.Code,
                    productDictResult.StatusCode,
                    productDictResult.Message);
            }

            var productDict = productDictResult.Data;

            var buildInvoiceResult = BuildInvoice(dto, productDict);

            if (!buildInvoiceResult.IsSuccess || buildInvoiceResult.Data == null)
            {
                return Result<SaleInvoiceDTO>
                .Failure(buildInvoiceResult.Code,
                buildInvoiceResult.StatusCode,
                buildInvoiceResult.Message);
            }

            var saleInvoice = buildInvoiceResult.Data;

            var updateStockResult = UpdateStock(saleInvoice.Items, productDict);

            if (!updateStockResult.IsSuccess)
            {
                return Result<SaleInvoiceDTO>
                .Failure(updateStockResult.Code,
                updateStockResult.StatusCode,
                updateStockResult.Message);
            }

            var addResult = await _unitOfWork.SaleInvoices.AddAsync(saleInvoice);
            if (!addResult.IsSuccess)
            {
                return Result<SaleInvoiceDTO>
                .Failure(addResult.Code,
                addResult.StatusCode,
                addResult.Message);
            }

            var saveResult = await _unitOfWork.SaveChangesAsync();

            if (!saveResult.IsSuccess)
            {
                return Result<SaleInvoiceDTO>.Failure(
                    saveResult.Code,
                    saveResult.StatusCode,
                    saveResult.Message);
            }

            var GetSaleInvoiceResult = await _unitOfWork.SaleInvoices.FindByAsync(pi => pi.Id == addResult.Data.Id,
            q => q.Include(pi => pi.Items)
            .ThenInclude(i => i.Product)
            .Include(pi => pi.Payments)
            .Include(pi => pi.Customer));

            if (!GetSaleInvoiceResult.IsSuccess || GetSaleInvoiceResult.Data == null)
            {
                return Result<SaleInvoiceDTO>
                .Failure(GetSaleInvoiceResult.Code,
                GetSaleInvoiceResult.StatusCode,
                GetSaleInvoiceResult.Message);
            }

            return Result<SaleInvoiceDTO>.Success(GetSaleInvoiceResult?.Data?.ToDTO());
        }
        #endregion

        #region GetAll
        public async Task<Result<PagedResult<SaleInvoiceDTO>>> GetFilteredAsync(SaleInvoiceFilterDTO filter)
        {

            var predicate = BuildInvoiceFilterExpression(filter);
            var orderBy = BuildInvoiceOrderByExpression(filter);

            var getPagedResult = await _unitOfWork.SaleInvoices.GetPagedAsync(
                filter: predicate,
                include: q => q
                .Include(i => i.Customer)
                .Include(i => i.Items).ThenInclude(i => i.Product)
                .Include(i => i.Payments),
                orderBy: orderBy,
                pageNumber: filter.PageNumber,
                pageSize: filter.PageSize
               );

            if (!getPagedResult.IsSuccess || getPagedResult.Data == null)
            {
                return Result<PagedResult<SaleInvoiceDTO>>.Failure(ResultCodes.PurchaseInvoicesNotFound);
            }

            var result = new PagedResult<SaleInvoiceDTO>()
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

            return Result<PagedResult<SaleInvoiceDTO>>.Success(result);


        }
        #endregion

        #region Helper
        private Expression<Func<SaleInvoice, bool>> BuildInvoiceFilterExpression(SaleInvoiceFilterDTO filter)
        {
            return invoice =>
                (string.IsNullOrEmpty(filter.Search) ||
                    invoice.InvoiceNumber.Contains(filter.Search)) &&

                (!filter.CustomerId.HasValue || invoice.CustomerId == filter.CustomerId) &&
                (!filter.Status.HasValue || invoice.Status == filter.Status) &&

                (!filter.FromDate.HasValue || invoice.InvoiceDate >= filter.FromDate) &&
                (!filter.ToDate.HasValue || invoice.InvoiceDate <= filter.ToDate) &&

                (!filter.MinTotal.HasValue || invoice.NetTotal >= filter.MinTotal) &&
                (!filter.MaxTotal.HasValue || invoice.NetTotal <= filter.MaxTotal);
        }

        private Func<IQueryable<SaleInvoice>, IOrderedQueryable<SaleInvoice>> BuildInvoiceOrderByExpression(SaleInvoiceFilterDTO filter)
        {
            return query =>
            {
                return filter.SortBy switch
                {
                    SaleInvoiceSortBy.Oldest =>
                        query.OrderBy(i => i.InvoiceDate),

                    SaleInvoiceSortBy.TotalLowToHigh =>
                        query.OrderBy(i => i.NetTotal),

                    SaleInvoiceSortBy.TotalHighToLow =>
                        query.OrderByDescending(i => i.NetTotal),

                    SaleInvoiceSortBy.InvoiceNumber =>
                        query.OrderBy(i => i.InvoiceNumber),

                    _ => query.OrderByDescending(i => i.InvoiceDate) // Newest
                };
            };
        }

        private Result<bool> ValidateRequest(SaleInvoiceDTO request)
        {
            if (request.Items == null || !request.Items.Any())
            {
                return Result<bool>.Failure(ResultCodes.NoItems, 400);
            }

            if (request.Payments == null || !request.Payments.Any())
            {
                return Result<bool>.Failure(ResultCodes.NoPayments, 400);
            }
  
            return Result<bool>.Success(true);
        }

        private async Task<Result<Dictionary<int, Product>>> LoadProductsAsync(List<SaleInvoiceItemDTO> items)
        {
            var productIds = items.Select(i => i.ProductId).Distinct().ToList();

            var result = await _unitOfWork.Products.GetByIdsAsync(productIds);

            if (!result.IsSuccess || result.Data == null)
            {
                return Result<Dictionary<int, Product>>.Failure(result.Code, result.StatusCode);
            }

            var missingIds = productIds.Except(result.Data.Select(p => p.Id)).ToList();

            if (missingIds.Any())
            {
                return Result<Dictionary<int, Product>>.Failure(
                    ResultCodes.SomeProductsNotFound,
                    500,
                    $"Missing products: {string.Join(",", missingIds)}"
                );
            }

            return Result<Dictionary<int, Product>>.Success(
                result.Data.ToDictionary(p => p.Id)
            );
        }

        private Result<List<SaleInvoiceItem>> BuildInvoiceItems(
       SaleInvoiceDTO dto,
       Dictionary<int, Product> productDict)
        {
            var items = new List<SaleInvoiceItem>();

            foreach (var item in dto.Items)
            {
                if (!productDict.TryGetValue(item.ProductId, out var product))
                {
                    return Result<List<SaleInvoiceItem>>.Failure(
                        ResultCodes.ProductNotFound,
                        404,
                        $"Product {item.ProductId} not found"
                    );
                }

                var IsStockValidResult = ValidateStock(product, item.Quantity);

                if (!IsStockValidResult.IsSuccess)
                {
                    return Result<List<SaleInvoiceItem>>
                        .Failure(IsStockValidResult.Code, 
                        IsStockValidResult.StatusCode, 
                        IsStockValidResult.Message);
                }
                
                var lineTotal = product.Price * item.Quantity;

                items.Add(new SaleInvoiceItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price,
                    //Total = lineTotal
                });

                
            }

            return Result<List<SaleInvoiceItem>>.Success(items);
        }

        private Result<List<SalePayment>> BuildPayments(
     SaleInvoiceDTO dto)
        {
            var payments = new List<SalePayment>();

            foreach (var payment in dto.Payments)
            {
                if (payment.Amount <= 0)
                {
                    return Result<List<SalePayment>>.Failure(ResultCodes.InvalidPayment);
                }

                payments.Add(payment.ToEntity());
            }

            return Result<List<SalePayment>>.Success(payments);

        }

        private decimal CalculateSaleInvoiceTotal(List<SaleInvoiceItem> items)
        {
            //return items.Sum(x => x.UnitPrice * x.Quantity);
            return items.Sum(x => x.Total);
        }

        private decimal CalculateSaleInvoicePaidAmount(List<SalePayment> payments)
        {
            return payments.Sum(x => x.Amount);
        }

        private decimal CalculateSaleInvoiceRemainingAmount(decimal total, decimal paid)
        {
            return  total - paid;
        }

        private decimal CalculateSaleInvoiceNetTotal(decimal total, decimal discount, decimal tax)
        {
            return total - discount + tax;
        }

        private Result<SaleInvoice> BuildInvoice(
       SaleInvoiceDTO dto, Dictionary<int, Product> productDict)
        {

            var itemsResult = BuildInvoiceItems(dto, productDict);

            if (!itemsResult.IsSuccess || itemsResult.Data == null || !itemsResult.Data.Any())
            {
                return Result<SaleInvoice>
                 .Failure(itemsResult.Code,
                 itemsResult.StatusCode,
                 itemsResult.Message);
            }

            var paymentsResult = BuildPayments(dto);

            if (!paymentsResult.IsSuccess || paymentsResult.Data == null || !paymentsResult.Data.Any())
            {
                return Result<SaleInvoice>
                 .Failure(paymentsResult.Code,
                 paymentsResult.StatusCode,
                 paymentsResult.Message);
            }

            var items = itemsResult.Data;
            var payments = paymentsResult.Data;
            var total = CalculateSaleInvoiceTotal(items);
            var paid = CalculateSaleInvoicePaidAmount(payments);
            var netTotal = CalculateSaleInvoiceNetTotal(total, dto.Discount ?? 0, dto.Tax ?? 0);

            var validatePaymentResult =
            ValidatePaymentAmount(netTotal, paid);

            if (!validatePaymentResult.IsSuccess)
            {
                return Result<SaleInvoice>.Failure(
                    validatePaymentResult.Code,
                    validatePaymentResult.StatusCode,
                    validatePaymentResult.Message);
            }

            var invoice = new SaleInvoice
            {
                GrandTotal = total,
                Discount = dto.Discount,
                Tax = dto.Tax,
                NetTotal = netTotal,
                Payments = payments,
                Items = items,
                Status = dto.Status ?? SaleInvoiceStatus.Approved,
                InvoiceNumber = GenerateInvoiceNumber(),
                InvoiceDate = dto.InvoiceDate ?? DateTime.UtcNow,
            };


            return Result<SaleInvoice>.Success(invoice);
        }

        private Result<bool> ValidateStock(
       Product product,
       decimal quantity)
        {
            if (quantity <= 0)
            {
                return Result<bool>.Failure(ResultCodes.InvalidQuantity);
            }

            if (product.StockQuantity < quantity)
            {
                return Result<bool>
                    .Failure(ResultCodes.InsufficientStock, 400, 
                    $"Insufficient stock for {product.NameEn}");
            }

            return Result<bool>.Success(true);
        }

        private Result<bool> UpdateStock(
      List<SaleInvoiceItem> items, Dictionary<int, Product> productDict)
        {

            foreach (var item in items)
            {
                if (!productDict.TryGetValue(item.ProductId, out var product))
                {
                    return Result<bool>.Failure(
                        ResultCodes.ProductNotFound,
                        404,
                        $"Product {item.ProductId} not found"
                    );
                }

                product.StockQuantity -= (int)item.Quantity;
            }

            return Result<bool>.Success(true);
        }

        private Result<bool> ValidatePaymentAmount(
       decimal total, decimal paid)
        {
            if (paid < total)
            {
                return Result<bool>.Failure(ResultCodes.InsufficientPayment); 
            }
                
            return Result<bool>.Success(true);
        }

        private string GenerateInvoiceNumber()
        {
            return $"INV-{DateTime.UtcNow:yyyy}-{Guid.NewGuid().ToString()[..6].ToUpper()}";
        }

        #endregion
    }
}
