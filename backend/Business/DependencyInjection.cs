using MarketFlow.Business.Interfaces;
using MarketFlow.Business.Services;

namespace MarketFlow.Business
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IImageService, ImageService>();

            services.AddScoped<ICategoryService, CategoryService>();

            return services;
        }
    }
}
