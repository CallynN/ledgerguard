using LedgerGuard.API.DTOs;
using LedgerGuard.API.Entities;
using LedgerGuard.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LedgerGuard.API.Controllers
{
    [ApiController]
    [Route("api/disputes")]
    [Authorize]
    public class DisputesController : ControllerBase
    {
        private readonly DisputeService _disputeService;

        public DisputesController(DisputeService disputeService)
        {
            _disputeService = disputeService;
        }

        /// <summary>
        /// Create a new dispute for a transaction
        /// </summary>
        /// <response code="201">Dispute created successfully</response>
        /// <response code="400">Invalid request</response>
        /// <response code="404">Transaction not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpPost]
        [ProducesResponseType(typeof(string), 201)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CreateDispute(CreateDisputeRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized(new { error = "Unauthorized" });

            await _disputeService.CreateDispute(Guid.Parse(userId), request);

            return StatusCode(201, "Dispute created successfully");
        }

        /// <summary>
        /// Get all disputes for the logged-in user
        /// </summary>
        /// <response code="200">Returns list of user disputes</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<Dispute>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetUserDisputes()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized(new { error = "Unauthorized" });

            var result = await _disputeService.GetUserDisputes(Guid.Parse(userId));

            return Ok(result);
        }
    }
}