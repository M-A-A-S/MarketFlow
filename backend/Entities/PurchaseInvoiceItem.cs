namespace MarketFlow.Entities
{
    public class PurchaseInvoiceItem : BaseEntity
    {
        public int PurchaseInvoiceId { get; set; }
        public int ProductId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        //public decimal Total { get; set; } // Total = Quantity * UnitPrice
        public decimal Total => Quantity * UnitPrice;

        public Product Product { get; set; }
        public PurchaseInvoice? PurchaseInvoice { get; set; }
    }
}
