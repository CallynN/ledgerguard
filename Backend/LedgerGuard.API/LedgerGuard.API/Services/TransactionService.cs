using LedgerGuard.API.Data;
using LedgerGuard.API.DTOs;
using LedgerGuard.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace LedgerGuard.API.Services
{
    public class TransactionService
    {
        private readonly AppDbContext _context;

        public TransactionService(AppDbContext context)
        {
            _context = context;
        }

        // Get transactions for a specific user (SECURE)
        public async Task<List<TransactionResponse>> GetUserTransactions(
            Guid userId,
            TransactionQueryParams query)
        {
            // Base query (VERY IMPORTANT: filter by user)
            var transactionsQuery = _context.Transactions
                .Where(t => t.UserId == userId)
                .AsQueryable();

            // Search filter
            if (!string.IsNullOrEmpty(query.Search))
            {
                transactionsQuery = transactionsQuery
                    .Where(t => t.Description.ToLower().Contains(query.Search.ToLower()));
            }

            // Status filter
            if (!string.IsNullOrEmpty(query.Status))
            {
                transactionsQuery = transactionsQuery
                    .Where(t => t.Status == query.Status);
            }

            // Pagination
            var skip = (query.Page - 1) * query.PageSize;

            var transactions = await transactionsQuery
                .OrderByDescending(t => t.TransactionDate)
                .Skip(skip)
                .Take(query.PageSize)
                .ToListAsync();

            // Map to DTO
            return transactions.Select(t => new TransactionResponse
            {
                Id = t.Id,
                Amount = t.Amount,
                Currency = t.Currency,
                Description = t.Description,
                Status = t.Status,
                TransactionDate = t.TransactionDate
            }).ToList();
        }
    }
}