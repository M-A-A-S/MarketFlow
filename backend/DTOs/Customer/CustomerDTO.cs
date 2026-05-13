using MarketFlow.DTOs.Person;

namespace MarketFlow.DTOs.Customer
{
    public class CustomerDTO
    {
        public int? Id { get; set; }
        public int? PersonId { get; set; }
        public PersonDTO? Person { get; set; }
    }
}
