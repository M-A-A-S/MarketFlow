using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Entities;

namespace MarketFlow.DataAccess.Repositories
{
    public class SalePaymentRepository : Repository<SalePayment>, ISalePaymentRepository
    {
        public SalePaymentRepository(AppDbContext context, ILogger<SalePayment> logger) : base(context, logger)
        {
        }
    }
}
