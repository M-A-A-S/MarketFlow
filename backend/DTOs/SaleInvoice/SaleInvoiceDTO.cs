using MarketFlow.DTOs.Customer;
using MarketFlow.DTOs.PurchaseInvoiceItem;
using MarketFlow.DTOs.PurchasePayment;
using MarketFlow.DTOs.SaleInvoiceItem;
using MarketFlow.DTOs.SalePayment;
using MarketFlow.DTOs.Supplier;
using MarketFlow.Enums;

namespace MarketFlow.DTOs.SaleInvoice
{
    public class SaleInvoiceDTO
    {
        public int? Id { get; set; }
        public DateTime? InvoiceDate { get; set; } = DateTime.UtcNow;
        public string? InvoiceNumber { get; set; }
        public SaleInvoiceStatus? Status { get; set; } = SaleInvoiceStatus.Approved;
        public int? CustomerId { get; set; }
        public decimal? GrandTotal { get; set; }
        public decimal? Discount { get; set; }
        public decimal? Tax { get; set; }
        public decimal? NetTotal { get; set; }

        public CustomerDTO? Customer { get; set; }
        public List<SaleInvoiceItemDTO> Items { get; set; } = new();
        public List<SalePaymentDTO>? Payments { get; set; } = new();

        // Read-only(for UI only)
        public decimal? PaidAmount { get; set; }
        public decimal? RemainingAmount { get; set; }
    }
}
