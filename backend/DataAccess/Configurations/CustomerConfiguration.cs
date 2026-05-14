using MarketFlow.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketFlow.DataAccess.Configurations
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.HasKey(s => s.Id);

            //builder.Property(s => s.PersonId)
            //    .IsRequired();

            builder.Property(s => s.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(s => s.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            //builder.HasOne(s => s.Person)
            //    .WithOne()
            //    .HasForeignKey<Customer>(s => s.PersonId)
            //    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
