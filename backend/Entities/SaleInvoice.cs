using MarketFlow.Enums;

namespace MarketFlow.Entities
{
    public class SaleInvoice : BaseEntity
    {
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public string InvoiceNumber { get; set; }
        public SaleInvoiceStatus Status { get; set; } = SaleInvoiceStatus.Approved;
        public int? CustomerId { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal? Discount { get; set; }
        public decimal? Tax { get; set; }
        public decimal NetTotal { get; set; }

        public Customer? Customer { get; set; }
        public List<SalePayment> Payments { get; set; } = new List<SalePayment>();
        public List<SaleInvoiceItem> Items { get; set; } = new List<SaleInvoiceItem>();

        public decimal GetPaidAmount() => Payments?.Sum(p => p.Amount) ?? 0;
        public decimal GetRemainingAmount() => NetTotal - GetPaidAmount();
    }
}
