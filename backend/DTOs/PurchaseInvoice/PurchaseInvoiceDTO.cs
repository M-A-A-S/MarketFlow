using MarketFlow.DTOs.PurchaseInvoiceItem;
using MarketFlow.DTOs.PurchasePayment;
using MarketFlow.DTOs.Supplier;
using MarketFlow.Enums;

namespace MarketFlow.DTOs.PurchaseInvoice
{
    public class PurchaseInvoiceDTO
    {
        public int? Id { get; set; }
        public DateTime? InvoiceDate { get; set; } = DateTime.UtcNow;
        public string? InvoiceNumber { get; set; }
        public PurchaseInvoiceStatus Status { get; set; } = PurchaseInvoiceStatus.Draft;
        public int SupplierId { get; set; }
        public decimal? TotalBeforeDiscount { get; set; }
        public decimal? Discount { get; set; }
        public decimal? Tax { get; set; }
        public decimal? NetTotal { get; set; }

        public SupplierDTO? Supplier { get; set; }
        public List<PurchaseInvoiceItemDTO> Items { get; set; } = new();
        public List<PurchasePaymentDTO> Payments { get; set; } = new();

        // Read-only(for UI only)
        public decimal? PaidAmount { get; set; }
        public decimal? RemainingAmount { get; set; }
    }
}
