using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.DataAccess
{
    public partial class AppDbContext
    {
        public DbSet<Product> Products { get; set; }    
        public DbSet<Category> Categories { get; set; }    
        public DbSet<Brand> Brands { get; set; }    
    }
}
