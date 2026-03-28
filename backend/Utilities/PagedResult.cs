namespace MarketFlow.Utilities
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int Total { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
