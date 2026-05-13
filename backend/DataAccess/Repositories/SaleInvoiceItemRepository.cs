using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;

namespace MarketFlow.DataAccess.Repositories
{
    public class SaleInvoiceItemRepository : Repository<SaleInvoiceItem>, ISaleInvoiceItemRepository
    {
        public SaleInvoiceItemRepository(AppDbContext context, ILogger<SaleInvoiceItem> logger) : base(context, logger)
        {
        }
    }
}
