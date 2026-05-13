using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.DTOs.SaleInvoice;
using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface ISaleInvoiceService
    {
        Task<Result<SaleInvoiceDTO>> AddAsync(SaleInvoiceDTO dto);
        //Task<Result<SaleInvoiceDTO>> UpdateAsync(int id, SaleInvoiceDTO dto);
        //Task<Result<bool>> DeleteAsync(int id);
        //Task<Result<SaleInvoiceDTO>> GetByIdAsync(int id);
        //Task<Result<IEnumerable<SaleInvoiceDTO>>> GetAllAsync();
        Task<Result<PagedResult<SaleInvoiceDTO>>> GetFilteredAsync(SaleInvoiceFilterDTO filter);
    }
}
