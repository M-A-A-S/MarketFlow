using MarketFlow.Enums;

namespace MarketFlow.DTOs.Product
{
    public class ProductFilterDTO
    {
        public string? Search { get; set; }
        public int? CategoryId { get; set; }
        public int? BrandId { get; set; }
        public bool? IsActive { get; set; }

        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public ProductSortBy? SortBy { get; set; } = ProductSortBy.Newest; 
    }
}
