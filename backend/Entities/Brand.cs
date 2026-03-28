using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketFlow.Entities
{
    public class Brand : BaseEntity
    {
        public string NameEn { get; set; }
        public string NameAr { get; set; }
        public string DescriptionEn { get; set; }
        public string DescriptionAr { get; set; }
        public string? ImageUrl { get; set; }
        public string? WebsiteUrl { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
