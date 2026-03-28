using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketFlow.DataAccess.Configurations
{
    public class BrandConfiguration : IEntityTypeConfiguration<Brand>
    {
        public void Configure(EntityTypeBuilder<Brand> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.NameEn).IsRequired().HasMaxLength(50).HasColumnType("varchar(50)");
            builder.Property(b => b.NameAr).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
            builder.Property(b => b.DescriptionEn).HasMaxLength(150).HasColumnType("varchar(150)");
            builder.Property(b => b.DescriptionAr).HasMaxLength(150).HasColumnType("nvarchar(150)");
            builder.Property(b => b.ImageUrl).HasMaxLength(255).HasColumnType("varchar(255)");
            builder.Property(b => b.WebsiteUrl).HasMaxLength(255).HasColumnType("varchar(255)");
        }
    }
}
