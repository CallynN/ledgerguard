namespace LedgerGuard.API.Entities
{
    public class DisputeNote
    {

        public Guid Id { get; set; }

        public Guid DisputeId { get; set; }

        public Guid AdminId { get; set; }

        public string Note { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
