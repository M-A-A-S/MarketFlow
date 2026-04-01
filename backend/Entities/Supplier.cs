namespace MarketFlow.Entities
{
    public class Supplier : BaseEntity
    {
        public int PersonId { get; set; }
        public Person Person { get; set; }
    }
}
