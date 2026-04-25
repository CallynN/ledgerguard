using Microsoft.EntityFrameworkCore;
using LedgerGuard.API.Entities;


namespace LedgerGuard.API.Data
{
    // This class represents your database session
    public class AppDbContext : DbContext
    {
        // Constructor required by EF Core
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        #region Tables
        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Dispute> Disputes { get; set; }
        public DbSet<DisputeNote> DisputeNotes { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Unique email constraint
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Prevent multiple disputes per transaction
            modelBuilder.Entity<Dispute>()
                .HasIndex(d => d.TransactionId)
                .IsUnique();
        }

    }
}
