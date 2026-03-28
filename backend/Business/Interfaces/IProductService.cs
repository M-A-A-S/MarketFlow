using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Product;
using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface IProductService
    {
        Task<Result<ProductDTO>> AddAsync(ProductDTO dto);
        Task<Result<ProductDTO>> UpdateAsync(int id, ProductDTO dto);
        Task<Result<bool>> DeleteAsync(int id);
        Task<Result<ProductDTO>> GetByIdAsync(int id);
        Task<Result<IEnumerable<ProductDTO>>> GetAllAsync();
        Task<Result<PagedResult<ProductDTO>>> GetFilteredAsync(ProductFilterDTO filter);
    }
}
