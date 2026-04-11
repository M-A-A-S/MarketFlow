using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;

namespace MarketFlow.DataAccess.Repositories
{
    public class PurchasePaymentRepository : Repository<PurchasePayment>, IPurchasePaymentRepository
    {
        public PurchasePaymentRepository(AppDbContext context, ILogger<PurchasePayment> logger)
            : base(context, logger)
        {
        }
    }
}
