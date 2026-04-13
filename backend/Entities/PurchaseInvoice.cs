using MarketFlow.Enums;

namespace MarketFlow.Entities
{
    public class PurchaseInvoice : BaseEntity
    {
       
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public string InvoiceNumber { get; set; }
        public PurchaseInvoiceStatus Status { get; set; } = PurchaseInvoiceStatus.Draft;
        public int SupplierId { get; set; }
        public decimal TotalBeforeDiscount { get; set; }
        public decimal Discount {  get; set; }
        public decimal Tax {  get; set; }
        public decimal NetTotal {  get; set; } // After Discount, Tax


        public Supplier? Supplier { get; set; }
        public List<PurchasePayment> Payments { get; set; } = new List<PurchasePayment>();
        public List<PurchaseInvoiceItem> Items { get; set; } = new List<PurchaseInvoiceItem>();

        public decimal GetPaidAmount() => Payments?.Sum(p => p.Amount) ?? 0;
        public decimal GetRemainingAmount() => NetTotal - GetPaidAmount();

    }
}
