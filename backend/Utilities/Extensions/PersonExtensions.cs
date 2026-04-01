using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Person;
using MarketFlow.Entities;

namespace MarketFlow.Utilities.Extensions
{
    public static class PersonExtensions
    {
        public static PersonDTO ToDTO(this Person entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new PersonDTO
            {
                Id = entity.Id,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Phone = entity.Phone,
                Gender = entity.Gender,
                DateOfBirth = entity.DateOfBirth,
                ImageUrl = entity.ImageUrl
            };
        }

        public static Person ToEntity(this PersonDTO DTO)
        {
            if (DTO == null)
            {
                return null;
            }

            return new Person
            {
                Id = DTO.Id ?? default,
                FirstName = DTO.FirstName,
                LastName = DTO.LastName,
                Phone = DTO.Phone,
                Gender = DTO.Gender,
                DateOfBirth = DTO.DateOfBirth,
                ImageUrl = DTO.ImageUrl
            };
        }

        public static void UpdateFromDTO(this Person entity, PersonDTO DTO)
        {

            if (entity == null || DTO == null)
            {
                return;
            }

            entity.FirstName = DTO.FirstName;
            entity.LastName = DTO.LastName;
            entity.Phone = DTO.Phone;
            entity.Gender = DTO.Gender;
            entity.ImageUrl = DTO.ImageUrl;
            entity.DateOfBirth = DTO.DateOfBirth;
        }

    }
}
