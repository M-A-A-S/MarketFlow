using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;

namespace MarketFlow.DataAccess.Repositories
{
    public class PurchaseInvoiceItemRepository : Repository<PurchaseInvoiceItem>, IPurchaseInvoiceItemRepository
    {
        public PurchaseInvoiceItemRepository(AppDbContext context, ILogger<PurchaseInvoiceItem> logger)
            : base(context, logger)
        {
        }
    }
}
