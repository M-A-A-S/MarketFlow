using MarketFlow.DTOs.PurchaseInvoiceItem;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class PurchaseInvoiceItemExtensions
    {
        public static PurchaseInvoiceItemDTO ToDTO(this PurchaseInvoiceItem entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new PurchaseInvoiceItemDTO
            {
                Id = entity.Id,
                PurchaseInvoiceId = entity.PurchaseInvoiceId,
                ProductId = entity.ProductId,
                Quantity = entity.Quantity,
                UnitPrice = entity.UnitPrice,
                //Total = entity.Quantity * entity.UnitPrice,
                Total = entity.Total,
                Product = entity.Product?.ToDTO()
            };
        }

        public static PurchaseInvoiceItem ToEntity(this PurchaseInvoiceItemDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new PurchaseInvoiceItem
            {
                Id = DTO.Id ?? 0,
                PurchaseInvoiceId = DTO.PurchaseInvoiceId ?? 0,
                ProductId = DTO.ProductId,
                Quantity = DTO.Quantity,
                UnitPrice = DTO.UnitPrice
            };
        }
        
        public static void UpdateFromDTO(this PurchaseInvoiceItem entity, PurchaseInvoiceItemDTO DTO)
        {
            if (entity == null || DTO == null)
            {
                return;
            }

            entity.ProductId = DTO.ProductId;
            entity.Quantity = DTO.Quantity;
            entity.UnitPrice = DTO.UnitPrice;
        }
    }
}
