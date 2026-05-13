namespace MarketFlow.Entities
{
    public class Customer : BaseEntity
    {
        public int PersonId { get; set; }
        public Person Person { get; set; }
    }
}
