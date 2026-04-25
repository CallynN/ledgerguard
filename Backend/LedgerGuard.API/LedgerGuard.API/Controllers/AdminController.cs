using LedgerGuard.API.DTOs;
using LedgerGuard.API.Entities;
using LedgerGuard.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LedgerGuard.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")] // ADMIN ONLY
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        /// <summary>
        /// Get all disputes (Admin only)
        /// </summary>
        [HttpGet("disputes")]
        [ProducesResponseType(typeof(List<Dispute>), 200)]
        public async Task<IActionResult> GetAllDisputes()
        {
            var result = await _adminService.GetAllDisputes();
            return Ok(result);
        }

        /// <summary>
        /// Update dispute status and assignment
        /// </summary>
        /// <response code="200">Dispute updated successfully</response>
        /// <response code="400">Invalid request</response>
        /// <response code="404">Dispute not found</response>
        [HttpPut("disputes/{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<IActionResult> UpdateDispute(Guid id, UpdateDisputeRequest request)
        {
            await _adminService.UpdateDispute(id, request);

            return Ok("Dispute updated");
        }

        /// <summary>
        /// Add a note to a dispute
        /// </summary>
        /// <response code="200">Note added successfully</response>
        /// <response code="400">Invalid request</response>
        /// <response code="404">Dispute not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpPost("disputes/{id}/notes")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddNote(Guid id, AddNoteRequest request)
        {
            var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (adminId == null)
                return Unauthorized(new { error = "Unauthorized" });

            await _adminService.AddNote(id, Guid.Parse(adminId), request);

            return Ok("Note added");
        }
    }
}