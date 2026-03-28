using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Product;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class ProductExtensions
    {
        public static ProductDTO ToDTO(this Product entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new ProductDTO
            {
                Id = entity.Id,
                NameEn = entity.NameEn,
                NameAr = entity.NameAr,
                DescriptionEn = entity.DescriptionEn,
                DescriptionAr = entity.DescriptionAr,
                ImageUrl = entity.ImageUrl,
                Price = entity.Price,
                Barcode = entity.Barcode,
                StockQuantity = entity.StockQuantity,
                IsActive = entity.IsActive,
                BrandId = entity.BrandId,
                Brand = entity.Brand?.ToDTO(),
                CategoryId = entity.CategoryId,
                Category = entity.Category?.ToDTO(),
            };
        }

        public static Product ToEntity(this ProductDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new Product
            {
                Id = DTO.Id ?? default,
                NameEn = DTO.NameEn,
                NameAr = DTO.NameAr,
                DescriptionEn = DTO.DescriptionEn,
                DescriptionAr = DTO.DescriptionAr,
                ImageUrl = DTO.ImageUrl,
                Price = DTO.Price,
                Barcode = DTO.Barcode,
                StockQuantity = DTO.StockQuantity,
                IsActive = DTO.IsActive,
                BrandId = DTO.BrandId,
                Brand = DTO.Brand?.ToEntity(),
                CategoryId = DTO.CategoryId,
                Category = DTO.Category?.ToEntity(),
            };
        }

        public static void UpdateFromDTO(this Product entity, ProductDTO DTO)
        {

            if (entity == null || DTO == null)
            {
                return;
            }

            entity.NameEn = DTO.NameEn;
            entity.NameAr = DTO.NameAr;
            entity.DescriptionEn = DTO.DescriptionEn;
            entity.DescriptionAr = DTO.DescriptionAr;
            entity.ImageUrl = DTO.ImageUrl;
            entity.Price = DTO.Price;
            entity.Barcode = DTO.Barcode;
            entity.StockQuantity = DTO.StockQuantity;
            entity.IsActive = DTO.IsActive;
            entity.BrandId = DTO.BrandId;
            entity.CategoryId = DTO.CategoryId;
        }
    }
}
