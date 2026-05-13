using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;

namespace MarketFlow.DataAccess.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context, ILogger<Customer> logger) : base(context, logger)
        {
        }
    }
}
