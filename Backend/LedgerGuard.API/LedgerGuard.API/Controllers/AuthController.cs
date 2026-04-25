using LedgerGuard.API.DTOs;
using LedgerGuard.API.Entities;
using LedgerGuard.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LedgerGuard.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly TokenService _tokenService;

        public AuthController(AuthService authService, TokenService tokenService)
        {
            _authService = authService;
            _tokenService = tokenService;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <response code="201">User registered successfully</response>
        /// <response code="400">Invalid request</response>
        [HttpPost("register")]
        [ProducesResponseType(typeof(string), 201)]
        [ProducesResponseType(typeof(object), 400)]
        public IActionResult Register(RegisterRequest request)
        {
            _authService.Register(request);

            return StatusCode(201, "User registered successfully");
        }

        /// <summary>
        /// Login and receive JWT token
        /// </summary>
        /// <response code="200">Returns JWT token and user info</response>
        /// <response code="401">Invalid credentials</response>
        [HttpPost("login")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(object), 401)]
        public IActionResult Login(LoginRequest request)
        {
            var user = _authService.Login(request);

            var token = _tokenService.CreateToken(user);

            return Ok(new
            {
                token,
                user.Id,
                user.Email,
                user.Role
            });
        }

        /// <summary>
        /// Test authenticated user
        /// </summary>
        /// <response code="200">User is authenticated</response>
        /// <response code="401">Unauthorized</response>
        [Authorize]
        [HttpGet("secure")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public IActionResult Secure()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new
            {
                Message = "You are authenticated",
                UserId = userId,
                Email = email,
                Role = role
            });
        }

        /// <summary>
        /// Admin-only endpoint
        /// </summary>
        /// <response code="200">Access granted</response>
        /// <response code="403">Forbidden</response>
        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        [ProducesResponseType(200)]
        [ProducesResponseType(403)]
        public IActionResult AdminOnly()
        {
            return Ok("Only admins can access this");
        }
    }
}