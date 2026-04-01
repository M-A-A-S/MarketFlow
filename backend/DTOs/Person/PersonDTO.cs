using MarketFlow.Enums;

namespace MarketFlow.DTOs.Person
{
    public class PersonDTO
    {
        public int? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageFile { get; set; }
        public Gender? Gender { get; set; } = null;
        public DateOnly? DateOfBirth { get; set; }
        public bool DeleteImage { get; set; } = false;
    }
}
