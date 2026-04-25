using System.ComponentModel.DataAnnotations;

namespace LedgerGuard.API.DTOs
{
    public class UpdateDisputeRequest
    {
        [Required]
        public string Status { get; set; }

        public Guid? AssignedTo { get; set; }

    }
}
