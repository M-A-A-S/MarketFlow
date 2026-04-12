using MarketFlow.DTOs.Product;
using MarketFlow.DTOs.PurchaseInvoice;

namespace MarketFlow.DTOs.PurchaseInvoiceItem
{
    public class PurchaseInvoiceItemDTO
    {
        public int? Id { get; set; }
        public int? PurchaseInvoiceId { get; set; }
        public int ProductId { get; set; }
        public decimal Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? Total { get; set; } // (for UI only)

        public ProductDTO? Product { get; set; }
        //public PurchaseInvoiceDTO? PurchaseInvoice { get; set; }
    }
}
