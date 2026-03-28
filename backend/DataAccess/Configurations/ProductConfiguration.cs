using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketFlow.DataAccess.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.NameEn).IsRequired().HasMaxLength(50).HasColumnType("varchar(50)");
            builder.Property(p => p.NameAr).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
            builder.Property(p => p.DescriptionEn).HasMaxLength(150).HasColumnType("varchar(150)");
            builder.Property(p => p.DescriptionAr).HasMaxLength(150).HasColumnType("nvarchar(150)");
            builder.Property(p => p.Barcode).IsRequired().HasMaxLength(50).HasColumnType("varchar(50)");
            builder.HasIndex(p => p.Barcode).IsUnique();
            builder.Property(p => p.Price).HasColumnType("decimal(18,2)");
            builder.Property(p => p.ImageUrl).HasMaxLength(255).HasColumnType("varchar(255)");
            builder.Property(p => p.IsActive).HasDefaultValue(true);

            builder.HasOne(p => p.Category).WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId).OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Brand).WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId).OnDelete(DeleteBehavior.SetNull);

        }
    }
}
