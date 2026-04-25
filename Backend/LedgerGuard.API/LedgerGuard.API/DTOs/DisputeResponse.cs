namespace LedgerGuard.API.DTOs
{
    public class DisputeResponse
    {
        public Guid Id { get; set; }

        public Guid TransactionId { get; set; }

        public string Status { get; set; }

        public string Reason { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
