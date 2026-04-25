namespace LedgerGuard.API.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; } // Unique identifier

        public Guid UserId { get; set; } // Owner of the transaction

        public decimal Amount { get; set; } // Transaction amount

        public string Currency { get; set; } // e.g. ZAR, USD

        public string Description { get; set; } // Description of transaction

        public string Status { get; set; } // e.g. Completed, Pending

        public DateTime TransactionDate { get; set; } // When it occurred

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
