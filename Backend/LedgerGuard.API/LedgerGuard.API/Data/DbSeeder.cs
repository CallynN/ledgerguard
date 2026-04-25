using LedgerGuard.API.Entities;

namespace LedgerGuard.API.Data
{
    // Insert Demo Data into the database for testing purposes
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            // If users does not exist -> Create Admin User 
            if (!context.Users.Any(u => u.Role == "Admin"))
            {
                var admin = new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Admin User",
                    Email = "admin@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(admin);
                context.SaveChanges();
            }

            // If users does not exist -> Create Customer User 
            if (!context.Users.Any(u => u.Role == "Customer"))
            {
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Seed User",
                    Email = "seed@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = "Customer",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(user);
                context.SaveChanges();
            }


            // If transactions already exist -> do nothing
            if (context.Transactions.Any())
                return;

            // Get existing users
            var users = context.Users.ToList();

            if (!users.Any())
                return;

            var transactions = new List<Transaction>();

            var random = new Random();

            foreach (var user in users)
            {
                // Create 20 fake transactions per user
                for (int i = 0; i < 20; i++)
                {
                    transactions.Add(new Transaction
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        Amount = random.Next(10, 5000),
                        Currency = "ZAR",
                        Description = GetRandomDescription(),
                        Status = GetRandomStatus(),
                        TransactionDate = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            context.Transactions.AddRange(transactions);
            context.SaveChanges();
        }

        private static string GetRandomDescription()
        {
            var descriptions = new[]
            {
                "Grocery Store",
                "Online Purchase",
                "Fuel Payment",
                "Restaurant",
                "Subscription",
                "Electricity Payment",
                "Transfer",
                "ATM Withdrawal"
            };

            return descriptions[new Random().Next(descriptions.Length)];
        }

        private static string GetRandomStatus()
        {
            var statuses = new[]
            {
                "Completed",
                "Pending",
                "Failed"
            };

            return statuses[new Random().Next(statuses.Length)];
        }
    }
}