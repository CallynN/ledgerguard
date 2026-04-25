namespace LedgerGuard.API.Entities
{
    public class User
    {
        public Guid Id { get; set; } // Unique identifier

        public string Name { get; set; } // Full name

        public string Email { get; set; } // Unique email

        public string PasswordHash { get; set; } // Hashed password

        public string Role { get; set; } = "Customer"; // Customer or Admin

        public bool IsActive { get; set; } = true; // Soft enable/disable

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
