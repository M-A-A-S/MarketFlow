using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DataAccess.Repositories;
using MarketFlow.Entities;

namespace MarketFlow.DataAccess
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationRepositories(this IServiceCollection services)
        {
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IBrandRepository, BrandRepository>();
            services.AddScoped<IPersonRepository, PersonRepository>();
            services.AddScoped<ISupplierRepository, SupplierRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IPurchaseInvoiceRepository, PurchaseInvoiceRepository>();
            services.AddScoped<IPurchaseInvoiceItemRepository, PurchaseInvoiceItemRepository>();
            services.AddScoped<IPurchasePaymentRepository, PurchasePaymentRepository>();
            services.AddScoped<ISaleInvoiceRepository, SaleInvoiceRepository>();
            services.AddScoped<ISaleInvoiceItemRepository, SaleInvoiceItemRepository>();
            services.AddScoped<ISalePaymentRepository, SalePaymentRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
