using MarketFlow.DTOs.PurchasePayment;
using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface IPurchasePaymentService
    {
        Task<Result<PurchasePaymentDTO>> AddAsync(PurchasePaymentDTO dto);
        Task<Result<IEnumerable<PurchasePaymentDTO>>> GetByInvoiceIdAsync(int invoiceId);
    }
}
