using MarketFlow.DTOs.Customer;
using MarketFlow.DTOs.Supplier;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class CustomerExtensions
    {
        public static CustomerDTO ToDTO(this Customer entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new CustomerDTO
            {
                Id = entity.Id,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Phone = entity.Phone
            };
        }

        public static Customer ToEntity(this CustomerDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new Customer
            {
                Id = DTO.Id ?? default,
                FirstName = DTO.FirstName,
                LastName = DTO.LastName,
                Phone = DTO.Phone,
            };
        }

        public static void UpdateFromDTO(this Customer entity, CustomerDTO DTO)
        {

            if (entity == null || DTO == null)
            {
                return;
            }

            entity.FirstName = DTO.FirstName;
            entity.LastName = DTO.LastName;  
            entity.Phone = DTO.Phone;
            
        }
    }
}
