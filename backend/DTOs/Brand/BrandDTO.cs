namespace MarketFlow.DTOs.Brand
{
    public class BrandDTO
    {
        public int? Id { get; set; }
        public string NameEn { get; set; }
        public string NameAr { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DescriptionAr { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? ImageUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public bool DeleteImage { get; set; } = false;
    }
}
