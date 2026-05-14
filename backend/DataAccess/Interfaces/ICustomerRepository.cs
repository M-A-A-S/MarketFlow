using MarketFlow.Entities;
using MarketFlow.Utilities;

namespace MarketFlow.DataAccess.Interfaces
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<Result<IEnumerable<Customer>>> GetDropdownAsync(string search);
    }
}
