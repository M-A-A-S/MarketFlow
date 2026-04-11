using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;

namespace MarketFlow.DataAccess.Repositories
{
    public class PurchaseInvoiceRepository : Repository<PurchaseInvoice>, IPurchaseInvoiceRepository
    {
        public PurchaseInvoiceRepository(AppDbContext context, ILogger<PurchaseInvoice> logger)
            : base(context, logger)
        {
        }
    }
}
