using LedgerGuard.API.Data;
using LedgerGuard.API.DTOs;
using LedgerGuard.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace LedgerGuard.API.Services
{
    public class AdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        // VIEW ALL DISPUTES
        public async Task<List<Dispute>> GetAllDisputes()
        {
            return await _context.Disputes
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        // UPDATE STATUS + ASSIGN
        public async Task UpdateDispute(Guid disputeId, UpdateDisputeRequest request)
        {
            var dispute = await _context.Disputes.FindAsync(disputeId);

            if (dispute == null)
                throw new Exception("Dispute not found");

            var validStatuses = new[] { "Pending", "UnderReview", "Resolved", "Rejected" };

            if (!validStatuses.Contains(request.Status, StringComparer.OrdinalIgnoreCase))
                throw new Exception("Invalid dispute status");

            dispute.Status = validStatuses
                .First(s => s.Equals(request.Status, StringComparison.OrdinalIgnoreCase));

            if (request.AssignedTo.HasValue)
            {
                var adminExists = await _context.Users
                    .AnyAsync(u => u.Id == request.AssignedTo && u.Role == "Admin");

                if (!adminExists)
                    throw new Exception("Assigned admin does not exist");

                dispute.AssignedTo = request.AssignedTo;
            }

            dispute.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        // ADD NOTE
        public async Task AddNote(Guid disputeId, Guid adminId, AddNoteRequest request)
        {
            var disputeExists = await _context.Disputes.AnyAsync(d => d.Id == disputeId);

            if (!disputeExists)
                throw new Exception("Dispute not found");

            var note = new DisputeNote
            {
                Id = Guid.NewGuid(),
                DisputeId = disputeId,
                AdminId = adminId,
                Note = request.Note,
                CreatedAt = DateTime.UtcNow
            };

            _context.DisputeNotes.Add(note);
            await _context.SaveChangesAsync();
        }
    }
}