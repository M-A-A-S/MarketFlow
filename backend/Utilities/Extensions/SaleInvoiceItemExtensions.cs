using MarketFlow.DTOs.PurchaseInvoiceItem;
using MarketFlow.DTOs.SaleInvoiceItem;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class SaleInvoiceItemExtensions
    {
        public static SaleInvoiceItemDTO ToDTO(this SaleInvoiceItem entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new SaleInvoiceItemDTO
            {
                Id = entity.Id,
                SaleInvoiceId = entity.SaleInvoiceId,
                ProductId = entity.ProductId,
                Quantity = entity.Quantity,
                UnitPrice = entity.UnitPrice,
                //Total = entity.Quantity * entity.UnitPrice,
                Total = entity.Total,
                Product = entity.Product?.ToDTO()
            };
        }

        public static SaleInvoiceItem ToEntity(this SaleInvoiceItemDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new SaleInvoiceItem
            {
                Id = DTO.Id ?? 0,
                SaleInvoiceId = DTO.SaleInvoiceId ?? 0,
                ProductId = DTO.ProductId,
                Quantity = DTO.Quantity,
                //UnitPrice = DTO.UnitPrice
            };
        }

        public static void UpdateFromDTO(this SaleInvoiceItem entity, SaleInvoiceItemDTO DTO)
        {
            if (entity == null || DTO == null)
            {
                return;
            }

            entity.ProductId = DTO.ProductId;
            entity.Quantity = DTO.Quantity;
            //entity.UnitPrice = DTO.UnitPrice;
        }
    }
}
