namespace LedgerGuard.API.DTOs
{
    // Data returned to client 
    public class TransactionResponse
    {
        public Guid Id { get; set; }

        public decimal Amount { get; set; }

        public string Currency { get; set; }

        public string Description { get; set; }

        public string Status { get; set; }

        public DateTime TransactionDate { get; set; }
    }
}
