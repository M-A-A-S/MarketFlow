using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Utilities;

namespace MarketFlow.DataAccess
{
    public interface IUnitOfWork : IDisposable
    //public interface IUnitOfWork 
    {
        ISaleInvoiceRepository SaleInvoices { get; }
        ISaleInvoiceItemRepository SaleInvoiceItems { get; }
        ISalePaymentRepository SalePayments { get; }
        IProductRepository Products { get; }

        Task<Result<bool>> SaveChangesAsync();
    }
}
