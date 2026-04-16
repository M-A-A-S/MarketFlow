using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface IPurchaseInvoiceService
    {
        Task<Result<PurchaseInvoiceDTO>> AddAsync(PurchaseInvoiceDTO dto);
        Task<Result<PurchaseInvoiceDTO>> UpdateAsync(int id, PurchaseInvoiceDTO dto);
        Task<Result<bool>> DeleteAsync(int id);
        Task<Result<PurchaseInvoiceDTO>> GetByIdAsync(int id);
        Task<Result<IEnumerable<PurchaseInvoiceDTO>>> GetAllAsync();
        Task<Result<PagedResult<PurchaseInvoiceDTO>>> GetFilteredAsync(PurchaseInvoiceFilterDTO filter);
    }
}
