using MarketFlow.Enums;

namespace MarketFlow.DTOs.Customer
{
    public class CustomerFilterDTO
    {
        public string? Search { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public CustomerSortBy? SortBy { get; set; } = CustomerSortBy.Newest;
    }
}
