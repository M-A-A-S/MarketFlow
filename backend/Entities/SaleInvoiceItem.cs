namespace MarketFlow.Entities
{
    public class SaleInvoiceItem : BaseEntity
    {
        public int SaleInvoiceId { get; set; }
        public int ProductId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        //public decimal Total { get; set; } // Total = Quantity * UnitPrice
        public decimal Total => Quantity * UnitPrice;

        public Product Product { get; set; }
        public SaleInvoice? SaleInvoice { get; set; }
    }
}
