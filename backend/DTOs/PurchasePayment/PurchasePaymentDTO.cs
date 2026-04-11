using MarketFlow.Enums;

namespace MarketFlow.DTOs.PurchasePayment
{
    public class PurchasePaymentDTO
    {
        public int? Id { get; set; }
        public int PurchaseInvoiceId { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? TransactionReference { get; set; }
        public string? Notes { get; set; }
    }
}
