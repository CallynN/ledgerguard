namespace LedgerGuard.API.Entities
{
    public class Dispute
    {
        public Guid Id { get; set; }

        public Guid TransactionId { get; set; } // Linked transaction

        public Guid UserId { get; set; } // Who raised it

        public string Status { get; set; } = "Pending";
        // Pending → UnderReview → Resolved / Rejected

        public string Reason { get; set; }

        public string Description { get; set; }

        public Guid? AssignedTo { get; set; } // Admin assigned (nullable)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
