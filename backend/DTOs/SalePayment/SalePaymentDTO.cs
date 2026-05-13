using MarketFlow.Enums;

namespace MarketFlow.DTOs.SalePayment
{
    public class SalePaymentDTO
    {
        public int? Id { get; set; }
        public int? SaleInvoiceId { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public decimal Amount { get; set; }
        public DateTime? PaymentDate { get; set; } = DateTime.UtcNow;
        public string? TransactionReference { get; set; }
        public string? Notes { get; set; }
    }
}
