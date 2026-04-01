using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Supplier;
using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface ISupplierService
    {
        Task<Result<SupplierDTO>> AddAsync(SupplierDTO dto);
        Task<Result<SupplierDTO>> UpdateAsync(int id, SupplierDTO dto);
        Task<Result<bool>> DeleteAsync(int id);
        Task<Result<SupplierDTO>> GetByIdAsync(int id);
        Task<Result<IEnumerable<SupplierDTO>>> GetAllAsync();
    }
}
