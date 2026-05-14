using MarketFlow.Enums;
using System.ComponentModel.DataAnnotations;

namespace MarketFlow.DTOs.Person
{
    public class PersonDTO
    {
        public int? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [RegularExpression(
            @"^(?:\+249|0)(?:[1-9][0-9])[0-9]{7}$",
            ErrorMessage = "Invalid Sudan phone number."
        )]
        public string Phone { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageFile { get; set; }
        public Gender? Gender { get; set; } = null;
        public DateOnly? DateOfBirth { get; set; }
        public bool DeleteImage { get; set; } = false;
    }
}
