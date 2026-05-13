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
                PersonId = entity.PersonId,
                Person = entity.Person.ToDTO(),
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
                PersonId = DTO.PersonId ?? default,
                Person = DTO.Person.ToEntity(),
            };
        }

        public static void UpdateFromDTO(this Customer entity, CustomerDTO DTO)
        {

            if (entity == null || DTO == null)
            {
                return;
            }

            entity.Person = DTO.Person.ToEntity();
        }
    }
}
