
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;

namespace MarketFlow.DataAccess.Repositories
{
    public class SaleInvoiceRepository : Repository<SaleInvoice>, ISaleInvoiceRepository
    {
        public SaleInvoiceRepository(AppDbContext context, ILogger<SaleInvoice> logger) : base(context, logger)
        {
        }
    }
}
