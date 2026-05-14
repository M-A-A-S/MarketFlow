using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Customer;
using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface ICustomerService
    {
        Task<Result<CustomerDTO>> AddAsync(CustomerDTO dto);
        Task<Result<CustomerDTO>> UpdateAsync(int id, CustomerDTO dto);
        Task<Result<bool>> DeleteAsync(int id);
        Task<Result<CustomerDTO>> GetByIdAsync(int id);
        Task<Result<IEnumerable<CustomerDTO>>> GetAllAsync();
        Task<Result<PagedResult<CustomerDTO>>> GetFilteredAsync(CustomerFilterDTO filter);
        Task<Result<IEnumerable<CustomerDropdownDTO>>> GetDropdownAsync(CustomerDropdownRequestDTO dto);
    }
}
