using MarketFlow.Enums;

namespace MarketFlow.Entities
{
    public class PurchasePayment : BaseEntity
    {
        public int PurchaseInvoiceId { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string? TransactionReference { get; set; }
        public string? Notes { get; set; }

        public PurchaseInvoice? PurchaseInvoice { get; set; }
    }
}
