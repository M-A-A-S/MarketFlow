using MarketFlow.DTOs.Product;

namespace MarketFlow.DTOs.SaleInvoiceItem
{
    public class SaleInvoiceItemDTO
    {
        public int? Id { get; set; }
        public int? SaleInvoiceId { get; set; }
        public int ProductId { get; set; }
        public decimal Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? Total { get; set; } // (for UI only)

        public ProductDTO? Product { get; set; }
    }
}
