using MarketFlow.Enums;

namespace MarketFlow.DTOs.PurchaseInvoice
{
    public class PurchaseInvoiceFilterDTO
    {
        public string? Search { get; set; }

        public int? SupplierId { get; set; }
        public PurchaseInvoiceStatus? Status { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        public decimal? MinTotal { get; set; }
        public decimal? MaxTotal { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public PurchaseInvoiceSortBy? SortBy { get; set; } = PurchaseInvoiceSortBy.Newest;
    }
}
