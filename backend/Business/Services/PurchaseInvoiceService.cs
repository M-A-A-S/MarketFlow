using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.DTOs.PurchaseInvoiceItem;
using MarketFlow.Entities;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;

namespace MarketFlow.Business.Services
{
    public class PurchaseInvoiceService : IPurchaseInvoiceService
    {
        private readonly IPurchaseInvoiceRepository _repo;
        private readonly IProductRepository _productRepo;

        public PurchaseInvoiceService(IPurchaseInvoiceRepository repo, IProductRepository productRepo)
        {
            _repo = repo;
            _productRepo = productRepo;
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
                return Result<PurchaseInvoiceDTO>.Failure(ResultCodes.PurchaseInvoiceNotFound, 404);
            }

            var entity = findByIdResult.Data;

            entity.UpdateFromDTO(dto);

            // Items handling (simple replace)
            entity.Items.Clear();

            if (dto.Items != null)
            {
                entity.Items = dto.Items.Select(x => x.ToEntity()).ToList();
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

            return Result<PurchaseInvoice>.Success(entity);
        }

        #endregion
    }
}
