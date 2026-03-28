using MarketFlow.DTOs.Category;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class CategoryExtensions
    {
        public static CategoryDTO ToDTO(this Category entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new CategoryDTO
            {
                Id = entity.Id,
                NameEn = entity.NameEn,
                NameAr = entity.NameAr,
                DescriptionEn = entity.DescriptionEn,
                DescriptionAr = entity.DescriptionAr,
                ImageUrl = entity.ImageUrl
            };
        }

        public static Category ToEntity(this CategoryDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new Category
            {
                Id = DTO.Id ?? default,
                NameEn = DTO.NameEn,
                NameAr = DTO.NameAr,
                DescriptionEn = DTO.DescriptionEn,
                DescriptionAr = DTO.DescriptionAr,
                ImageUrl = DTO.ImageUrl
            };
        }

        public static void UpdateFromDTO(this Category entity, CategoryDTO DTO)
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
        }
    }
}
