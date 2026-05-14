using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;
using MarketFlow.Utilities;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.DataAccess.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context, ILogger<Customer> logger) : base(context, logger)
        {
        }

        public async Task<Result<IEnumerable<Customer>>> GetDropdownAsync(string search)
        {
            try
            {
                var query = _context.Customers.AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    search = search.Trim().ToLower();

                    query = query.Where(c =>
                        c.FirstName.ToLower().Contains(search) ||
                        c.LastName.Contains(search) ||
                        c.Phone.Contains(search));
                }

                var result = await query
                    .AsNoTracking()
                    .Select(c => new Customer
                    {
                        Id = c.Id,
                        FirstName = c.FirstName,
                        LastName = c.LastName,
                        Phone = c.Phone,
                    })
                    .Take(20)
                    .ToListAsync();

                return Result<IEnumerable<Customer>>.Success(result);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<Customer>>.Failure(ResultCodes.ServerError, 500, ex.Message);
            }
        }
    }
}
