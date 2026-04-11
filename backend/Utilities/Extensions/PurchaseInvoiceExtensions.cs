using MarketFlow.DTOs.PurchaseInvoice;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class PurchaseInvoiceExtensions
    {
        public static PurchaseInvoiceDTO ToDTO(this PurchaseInvoice entity)
        {
            if (entity == null)
            {
                return null;
            }

            //var paid = entity.Payments?.Sum(p => p.Amount) ?? 0;

            return new PurchaseInvoiceDTO
            {
                Id = entity.Id,
                InvoiceDate = entity.InvoiceDate,
                InvoiceNumber = entity.InvoiceNumber,
                SupplierId = entity.SupplierId,
                TotalBeforeDiscount = entity.TotalBeforeDiscount,
                Discount = entity.Discount,
                Tax = entity.Tax,
                NetTotal = entity.NetTotal,
                Supplier = entity.Supplier?.ToDTO(),
                Items = entity.Items?.Select(i => i.ToDTO()).ToList(),
                Payments = entity.Payments?.Select(p => p.ToDTO()).ToList(),
                //PaidAmount = paid,
                //RemainingAmount = entity.NetTotal - paid
                PaidAmount = entity.GetPaidAmount(),
                RemainingAmount = entity.GetRemainingAmount(),
            };
        }

        public static PurchaseInvoice ToEntity(this PurchaseInvoiceDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new PurchaseInvoice
            {
                Id = DTO.Id ?? 0,
                InvoiceDate = DTO.InvoiceDate,
                InvoiceNumber = DTO.InvoiceNumber,
                SupplierId = DTO.SupplierId,
                TotalBeforeDiscount = DTO.TotalBeforeDiscount,
                Discount = DTO.Discount,
                Tax = DTO.Tax,
                NetTotal = DTO.NetTotal,
                Items = DTO.Items?.Select(i => i.ToEntity()).ToList(),
                Payments = DTO.Payments?.Select(p => p.ToEntity()).ToList(),
            };
        }

        public static void UpdateFromDTO(this PurchaseInvoice entity, PurchaseInvoiceDTO DTO)
        {
            if (entity == null || DTO == null)
            {
                return;
            }

            entity.InvoiceDate = DTO.InvoiceDate;
            entity.SupplierId = DTO.SupplierId;

            entity.TotalBeforeDiscount = DTO.TotalBeforeDiscount;
            entity.Discount = DTO.Discount;
            entity.Tax = DTO.Tax;
            entity.NetTotal = DTO.NetTotal;
        }

    }
}
