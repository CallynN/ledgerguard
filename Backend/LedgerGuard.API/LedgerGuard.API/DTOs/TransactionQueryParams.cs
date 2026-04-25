namespace LedgerGuard.API.DTOs
{
    // Query parameters for filtering & pagination
    public class TransactionQueryParams
    {
        public int Page { get; set; } = 1;

        public int PageSize { get; set; } = 10;

        public string? Search { get; set; }

        public string? Status { get; set; }
    }
}
