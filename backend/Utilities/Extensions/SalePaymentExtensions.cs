using MarketFlow.DTOs.PurchasePayment;
using MarketFlow.DTOs.SalePayment;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class SalePaymentExtensions
    {
        public static SalePaymentDTO ToDTO(this SalePayment entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new SalePaymentDTO
            {
                Id = entity.Id,
                SaleInvoiceId = entity.SaleInvoiceId,
                PaymentMethod = entity.PaymentMethod,
                Amount = entity.Amount,
                PaymentDate = entity.PaymentDate,
                TransactionReference = entity.TransactionReference,
                Notes = entity.Notes
            };
        }

        public static SalePayment ToEntity(this SalePaymentDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new SalePayment
            {
                Id = DTO.Id ?? 0,
                SaleInvoiceId = DTO.SaleInvoiceId ?? 0,
                PaymentMethod = DTO.PaymentMethod,
                Amount = DTO.Amount,
                PaymentDate = DTO.PaymentDate ?? DateTime.UtcNow,
                TransactionReference = DTO.TransactionReference,
                Notes = DTO.Notes
            };
        }

        public static void UpdateFromDTO(this SalePayment entity, SalePaymentDTO DTO)
        {
            if (entity == null || DTO == null)
            {
                return;
            }

            entity.PaymentMethod = DTO.PaymentMethod;
            entity.Amount = DTO.Amount;
            //entity.PaymentDate = DTO?.PaymentDate;
            entity.TransactionReference = DTO.TransactionReference;
            entity.Notes = DTO.Notes;
        }
    }
}
