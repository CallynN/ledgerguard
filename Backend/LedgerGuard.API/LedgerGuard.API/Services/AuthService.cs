using LedgerGuard.API.Data;
using LedgerGuard.API.DTOs;
using LedgerGuard.API.Entities;


namespace LedgerGuard.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        // Inject database context
        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        // REGISTER USER
        public void Register(RegisterRequest request)
        {
            // Check if email already exists
            var existingUser = _context.Users.FirstOrDefault(x => x.Email == request.Email);
            if (existingUser != null)
                throw new Exception("Email already exists");

            // Hash password using BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = "Customer" // default role
            };

            _context.Users.Add(user);
            _context.SaveChanges();
        }

        // LOGIN USER
        public User Login(LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(x => x.Email == request.Email);

            if (user == null)
                throw new Exception("Invalid credentials");

            // Verify password
            bool isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isValid)
                throw new Exception("Invalid credentials");

            return user;
        }

    }
}
