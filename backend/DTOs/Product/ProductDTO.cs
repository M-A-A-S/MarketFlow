using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Category;

namespace MarketFlow.DTOs.Product
{
    public class ProductDTO
    {
        public int? Id { get; set; }
        public string NameEn { get; set; }
        public string NameAr { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionAr { get; set; }

        public decimal Price { get; set; }
        public string Barcode { get; set; }
        public int StockQuantity { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;

        public int CategoryId { get; set; }
        public CategoryDTO? Category { get; set; }

        public int? BrandId { get; set; }
        public BrandDTO? Brand { get; set; }
        public bool DeleteImage { get; set; } = false;
    }
}
