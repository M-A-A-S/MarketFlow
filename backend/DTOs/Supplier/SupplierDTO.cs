using MarketFlow.DTOs.Person;

namespace MarketFlow.DTOs.Supplier
{
    public class SupplierDTO
    {
        public int? Id { get; set; }
        public int? PersonId { get; set; }
        public PersonDTO Person { get; set; }
    }
}
