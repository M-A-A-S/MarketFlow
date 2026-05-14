using MarketFlow.DTOs.Person;
using System.ComponentModel.DataAnnotations;

namespace MarketFlow.DTOs.Customer
{
    public class CustomerDTO
    {
        public int? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [RegularExpression(
            @"^(?:\+249|0)(?:[1-9][0-9])[0-9]{7}$",
            ErrorMessage = "Invalid Sudan phone number."
        )]
        public string Phone { get; set; }
        //public int? PersonId { get; set; }
        //public PersonDTO? Person { get; set; }
    }
}
