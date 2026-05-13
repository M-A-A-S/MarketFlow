using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;
using MarketFlow.Utilities;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.DataAccess.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context, ILogger<Product> logger)
        : base(context, logger)
        {
        }

        public async Task<Result<IEnumerable<Product>>> GetDropdownAsync(string search)
        {
            try
            {
                var query = _context.Products.AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    search = search.Trim().ToLower();

                    query = query.Where(p =>
                        p.NameEn.ToLower().Contains(search) ||
                        p.NameAr.Contains(search));
                }

                var result = await query
                    .AsNoTracking()
                    .Select(p => new Product
                    {
                        Id = p.Id,
                        NameEn = p.NameEn,
                        NameAr = p.NameAr,
                        Price = p.Price,
                    })
                    .Take(20)
                    .ToListAsync();

                return Result<IEnumerable<Product>>.Success(result);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<Product>>.Failure(ex.Message, 500);
            }
        }

        public async Task<Result<List<Product>>> GetByIdsAsync(List<int> productIds)
        {
            if (productIds == null || !productIds.Any())
            {
                return Result<List<Product>>.Failure(ResultCodes.NoProductIdsProvided, 400);
            }

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                //.AsNoTracking()
                .ToListAsync();

            if (products.Count == 0)
            {
                return Result<List<Product>>.Failure(ResultCodes.ProductsNotFound, 404);
            }

            return Result<List<Product>>.Success(products);
        }

    }
}
