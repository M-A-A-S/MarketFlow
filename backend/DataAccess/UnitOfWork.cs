using MarketFlow.DataAccess.Interfaces;
using MarketFlow.Utilities;
using MarketFlow.Utilities.ResultCodes;

namespace MarketFlow.DataAccess
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        IProductRepository Products { get; }
        ISaleInvoiceRepository SaleInvoices { get; }
        ISaleInvoiceItemRepository SaleInvoiceItems { get; }
        ISalePaymentRepository SalePayments { get; }

        public UnitOfWork(
          AppDbContext context,
          IProductRepository products,
          ISaleInvoiceRepository saleInvoices,
          ISaleInvoiceItemRepository saleInvoiceItems,
          ISalePaymentRepository salePayments
        )
        {
            _context = context;

            SaleInvoices = saleInvoices;
            Products = products;
            SaleInvoiceItems = saleInvoiceItems;
            SalePayments = salePayments;
        }

        public async Task<Result<bool>> SaveChangesAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure(
                    ResultCodes.DbError,
                    500,
                    ex.Message);
            }
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
