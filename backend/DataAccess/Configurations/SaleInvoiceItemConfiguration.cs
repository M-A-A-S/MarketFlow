using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketFlow.DataAccess.Configurations
{
    public class SaleInvoiceItemConfiguration : IEntityTypeConfiguration<SaleInvoiceItem>
    {
        public void Configure(EntityTypeBuilder<SaleInvoiceItem> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Quantity)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(x => x.UnitPrice)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            //builder.Property(x => x.Total)
            //    .HasColumnType("decimal(18,2)");


            //builder.Property(x => x.Total)
            //    .HasColumnType("decimal(18,2)")
            //    .HasComputedColumnSql("[Quantity] * [UnitPrice]");

            builder.Ignore(x => x.Total);


            builder.HasOne(x => x.SaleInvoice)
                .WithMany(x => x.Items)
                .HasForeignKey(x => x.SaleInvoiceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
