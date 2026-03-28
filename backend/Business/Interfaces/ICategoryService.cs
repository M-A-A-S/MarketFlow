using MarketFlow.DTOs.Category;
using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<CategoryDTO>> AddAsync(CategoryDTO dto);
        Task<Result<CategoryDTO>> UpdateAsync(int id, CategoryDTO dto);
        Task<Result<bool>> DeleteAsync(int id);
        Task<Result<CategoryDTO>> GetByIdAsync(int id);
        Task<Result<IEnumerable<CategoryDTO>>> GetAllAsync();
    }
}
