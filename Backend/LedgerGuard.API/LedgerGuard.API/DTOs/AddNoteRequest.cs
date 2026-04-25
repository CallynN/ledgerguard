using System.ComponentModel.DataAnnotations;

namespace LedgerGuard.API.DTOs
{
    public class AddNoteRequest
    {
        [Required]
        [StringLength(1000)]
        public string Note { get; set; }

    }
}
