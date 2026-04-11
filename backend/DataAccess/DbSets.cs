using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketFlow.DataAccess
{
    public partial class AppDbContext
    {
        public DbSet<Product> Products { get; set; }    
        public DbSet<Category> Categories { get; set; }    
        public DbSet<Brand> Brands { get; set; }

        public DbSet<Person> People { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        public DbSet<PurchaseInvoice> PurchaseInvoices { get; set; }
        public DbSet<PurchaseInvoiceItem> PurchaseInvoiceItems { get; set; }
        public DbSet<PurchasePayment> PurchasePayments { get; set; }
    }
}
