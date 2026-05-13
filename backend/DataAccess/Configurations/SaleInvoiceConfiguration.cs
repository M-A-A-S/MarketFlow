using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketFlow.DataAccess.Configurations
{
    public class SaleInvoiceConfiguration : IEntityTypeConfiguration<SaleInvoice>
    {
        public void Configure(EntityTypeBuilder<SaleInvoice> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.InvoiceDate)
                .IsRequired();

            builder.Property(x => x.InvoiceNumber)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnType("varchar(50)");

            builder.HasIndex(x => x.InvoiceNumber)
                .IsUnique();

            builder.Property(x => x.GrandTotal)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.Discount)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.Tax)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.NetTotal)
                .HasColumnType("decimal(18,2)");

            builder.HasOne(x => x.Customer)
                .WithMany()
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Items)
                .WithOne(i => i.SaleInvoice)
                .HasForeignKey(i => i.SaleInvoiceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Payments)
                .WithOne(p => p.SaleInvoice)
                .HasForeignKey(p => p.SaleInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
