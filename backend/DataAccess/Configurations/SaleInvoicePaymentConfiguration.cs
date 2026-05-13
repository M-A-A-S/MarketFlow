using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketFlow.DataAccess.Configurations
{
    public class SaleInvoicePaymentConfiguration : IEntityTypeConfiguration<SalePayment>
    {
        public void Configure(EntityTypeBuilder<SalePayment> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Amount)
                .HasColumnType("decimal(18,2)");

            builder.Property(x => x.PaymentDate)
                .IsRequired();

            builder.Property(x => x.TransactionReference)
                .HasMaxLength(100)
                .HasColumnType("varchar(100)");

            builder.Property(x => x.Notes)
                .HasMaxLength(250)
                .HasColumnType("nvarchar(250)");

            builder.Property(x => x.PaymentMethod)
                .IsRequired();
        }
    }
}
