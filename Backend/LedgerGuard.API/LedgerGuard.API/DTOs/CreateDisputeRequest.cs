using System.ComponentModel.DataAnnotations;

namespace LedgerGuard.API.DTOs
{
    public class CreateDisputeRequest
    {
        [Required]
        public Guid TransactionId { get; set; }

        [Required]
        [StringLength(200)]
        public string Reason { get; set; }

        [Required]
        [StringLength(1000)]
        public string Description { get; set; }
    }
}
