using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Category;
using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface IBrandService
    {
        Task<Result<BrandDTO>> AddAsync(BrandDTO dto);
        Task<Result<BrandDTO>> UpdateAsync(int id, BrandDTO dto);
        Task<Result<bool>> DeleteAsync(int id);
        Task<Result<BrandDTO>> GetByIdAsync(int id);
        Task<Result<IEnumerable<BrandDTO>>> GetAllAsync();
    }
}
