using MarketFlow.DTOs.PurchasePayment;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class PurchasePaymentExtensions
    {
        public static PurchasePaymentDTO ToDTO(this PurchasePayment entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new PurchasePaymentDTO
            {
                Id = entity.Id,
                PurchaseInvoiceId = entity.PurchaseInvoiceId,
                PaymentMethod = entity.PaymentMethod,
                Amount = entity.Amount,
                PaymentDate = entity.PaymentDate,
                TransactionReference = entity.TransactionReference,
                Notes = entity.Notes
            };
        }

        public static PurchasePayment ToEntity(this PurchasePaymentDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new PurchasePayment
            {
                Id = DTO.Id ?? 0,
                //PurchaseInvoiceId = DTO.PurchaseInvoiceId,
                PaymentMethod = DTO.PaymentMethod,
                Amount = DTO.Amount,
                PaymentDate = DTO.PaymentDate,
                TransactionReference = DTO.TransactionReference,
                Notes = DTO.Notes
            };
        }

        public static void UpdateFromDTO(this PurchasePayment entity, PurchasePaymentDTO DTO)
        {
            if (entity == null || DTO == null)
            {
                return;
            }

            entity.PaymentMethod = DTO.PaymentMethod;
            entity.Amount = DTO.Amount;
            entity.PaymentDate = DTO.PaymentDate;
            entity.TransactionReference = DTO.TransactionReference;
            entity.Notes = DTO.Notes;
        }
    }
}
