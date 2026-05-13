using MarketFlow.Enums;

namespace MarketFlow.DTOs.SaleInvoice
{
    public class SaleInvoiceFilterDTO
    {
        public string? Search { get; set; }

        public int? CustomerId { get; set; }
        public SaleInvoiceStatus? Status { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        public decimal? MinTotal { get; set; }
        public decimal? MaxTotal { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public SaleInvoiceSortBy? SortBy { get; set; } = SaleInvoiceSortBy.Newest;
    }
}
