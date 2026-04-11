using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;

namespace MarketFlow.Business.Services
{
    public class PurchaseInvoiceService : IPurchaseInvoiceService
    {
        private readonly IPurchaseInvoiceRepository _repo;

        public PurchaseInvoiceService(IPurchaseInvoiceRepository repo)
        {
            _repo = repo;
        }

        #region Add
        public async Task<Result<PurchaseInvoiceDTO>> AddAsync(PurchaseInvoiceDTO dto)
        {

            var entity = dto.ToEntity();

            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess || addResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(addResult.Code, addResult.StatusCode);
            }

            // Generate Invoice Number AFTER Save (because we need ID)
            var invoice = addResult.Data;

            invoice.InvoiceNumber = GenerateInvoiceNumber(invoice.Id);

            var updateResult = await _repo.UpdateAndSaveAsync(invoice);

            if (!updateResult.IsSuccess || updateResult.Data == null)
            {
                return Result<PurchaseInvoiceDTO>
                    .Failure(updateResult.Code, updateResult.StatusCode);
            }

            return Result<PurchaseInvoiceDTO>.Success(updateResult.Data.ToDTO());
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
        private string GenerateInvoiceNumber(int id)
        {
            //return $"PINV-{Guid.NewGuid().ToString()[..8].ToUpper()}-{id}";
            return $"INV-{DateTime.UtcNow:yyyy}-{id:000000}";
        }
        #endregion
    }
}
