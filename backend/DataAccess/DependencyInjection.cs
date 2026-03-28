using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DataAccess.Repositories;

namespace MarketFlow.DataAccess
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationRepositories(this IServiceCollection services)
        {
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IBrandRepository, BrandRepository>();

            return services;
        }
    }
}
