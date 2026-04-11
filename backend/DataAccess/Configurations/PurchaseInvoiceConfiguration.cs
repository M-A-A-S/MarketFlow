using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketFlow.DataAccess.Configurations
{
    public class PurchaseInvoiceConfiguration : IEntityTypeConfiguration<PurchaseInvoice>
    {
        public void Configure(EntityTypeBuilder<PurchaseInvoice> builder)
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

            builder.Property(x => x.TotalBeforeDiscount)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.Discount)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.Tax)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.NetTotal)
                .HasColumnType("decimal(18,2)");

            builder.HasOne(x => x.Supplier)
                .WithMany()
                .HasForeignKey(x => x.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Items)
                .WithOne(i => i.PurchaseInvoice)
                .HasForeignKey(i => i.PurchaseInvoiceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Payments)
                .WithOne(p => p.PurchaseInvoice)
                .HasForeignKey(p => p.PurchaseInvoiceId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
