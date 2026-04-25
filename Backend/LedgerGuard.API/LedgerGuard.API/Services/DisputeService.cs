using LedgerGuard.API.Data;
using LedgerGuard.API.DTOs;
using LedgerGuard.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace LedgerGuard.API.Services
{
    public class DisputeService
    {
        private readonly AppDbContext _context;

        public DisputeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateDispute(Guid userId, CreateDisputeRequest request)
        {
            //Ensure transaction exists and belongs to user
            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == request.TransactionId && t.UserId == userId);

            if (transaction == null)
                throw new Exception("Transaction not found");

            //Prevent duplicate dispute
            var existingDispute = await _context.Disputes
                .AnyAsync(d => d.TransactionId == request.TransactionId);

            if (existingDispute)
                throw new Exception("Dispute already exists for this transaction");

            var dispute = new Dispute
            {
                Id = Guid.NewGuid(),
                TransactionId = request.TransactionId,
                UserId = userId,
                Status = "Pending",
                Reason = request.Reason,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.Disputes.Add(dispute);
            await _context.SaveChangesAsync();
        }

        public async Task<List<DisputeResponse>> GetUserDisputes(Guid userId)
        {
            var disputes = await _context.Disputes
                .Where(d => d.UserId == userId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return disputes.Select(d => new DisputeResponse
            {
                Id = d.Id,
                TransactionId = d.TransactionId,
                Status = d.Status,
                Reason = d.Reason,
                Description = d.Description,
                CreatedAt = d.CreatedAt
            }).ToList();
        }
    }
}