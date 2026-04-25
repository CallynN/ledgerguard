using LedgerGuard.API.DTOs;
using LedgerGuard.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using LedgerGuard.API.Entities;

namespace LedgerGuard.API.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    [Authorize] // ALL endpoints require JWT
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionService _transactionService;

        public TransactionsController(TransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        /// <summary>
        /// Get transactions for the logged-in user (with filtering & pagination)
        /// </summary>
        /// <response code="200">Returns list of transactions</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<Transaction>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetTransactions([FromQuery] TransactionQueryParams query)
        {
            // Extract user ID from JWT
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized(new { error = "Unauthorized" });

            var result = await _transactionService.GetUserTransactions(
                Guid.Parse(userId),
                query);

            return Ok(result);
        }
    }
}