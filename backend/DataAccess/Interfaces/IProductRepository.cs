using MarketFlow.Entities;
using MarketFlow.Utilities;

namespace MarketFlow.DataAccess.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<Result<IEnumerable<Product>>> GetDropdownAsync(string search);
    }
}
