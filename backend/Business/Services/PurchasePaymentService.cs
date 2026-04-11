using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.PurchasePayment;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;

namespace MarketFlow.Business.Services
{
    public class PurchasePaymentService : IPurchasePaymentService
    {
        private readonly IPurchasePaymentRepository _repo;

        public PurchasePaymentService(IPurchasePaymentRepository repo)
        {
            _repo = repo;
        }

        public async Task<Result<PurchasePaymentDTO>> AddAsync(PurchasePaymentDTO dto)
        {
            var entity = dto.ToEntity();

            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess || addResult.Data == null)
            {
                return Result<PurchasePaymentDTO>
                    .Failure(addResult.Code, addResult.StatusCode);
            }

            return Result<PurchasePaymentDTO>.Success(addResult.Data.ToDTO());
        }

        public async Task<Result<IEnumerable<PurchasePaymentDTO>>> GetByInvoiceIdAsync(int invoiceId)
        {
            var findByInvoiceIdResult = await _repo.GetAllAsync(x => x.PurchaseInvoiceId == invoiceId);

            if (!findByInvoiceIdResult.IsSuccess || findByInvoiceIdResult.Data == null)
            {
                return Result<IEnumerable<PurchasePaymentDTO>>
                    .Failure(findByInvoiceIdResult.Code, findByInvoiceIdResult.StatusCode);
            }

            return Result<IEnumerable<PurchasePaymentDTO>>
                .Success(findByInvoiceIdResult.Data.Select(x => x.ToDTO()));
        }
    }
}
