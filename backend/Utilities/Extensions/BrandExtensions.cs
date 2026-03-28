using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Category;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class BrandExtensions
    {
        public static BrandDTO ToDTO(this Brand entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new BrandDTO
            {
                Id = entity.Id,
                NameEn = entity.NameEn,
                NameAr = entity.NameAr,
                DescriptionEn = entity.DescriptionEn,
                DescriptionAr = entity.DescriptionAr,
                ImageUrl = entity.ImageUrl,
                WebsiteUrl = entity.WebsiteUrl,
            };
        }

        public static Brand ToEntity(this BrandDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new Brand
            {
                Id = DTO.Id ?? default,
                NameEn = DTO.NameEn,
                NameAr = DTO.NameAr,
                DescriptionEn = DTO.DescriptionEn,
                DescriptionAr = DTO.DescriptionAr,
                ImageUrl = DTO.ImageUrl,
                WebsiteUrl = DTO.WebsiteUrl
            };
        }

        public static void UpdateFromDTO(this Brand entity, BrandDTO DTO)
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
            entity.WebsiteUrl = DTO.WebsiteUrl;
        }
    }
}
