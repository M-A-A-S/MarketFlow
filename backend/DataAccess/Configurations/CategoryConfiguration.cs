using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketFlow.DataAccess.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.NameEn).IsRequired().HasMaxLength(50).HasColumnType("varchar(50)");
            builder.Property(c => c.NameAr).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
            builder.Property(c => c.DescriptionEn).HasMaxLength(150).HasColumnType("varchar(150)");
            builder.Property(c => c.DescriptionAr).HasMaxLength(150).HasColumnType("nvarchar(150)");
            builder.Property(c => c.ImageUrl).HasMaxLength(255).HasColumnType("varchar(255)");
        }
    }
}
