using System.Net;
using System.Text.Json;

namespace LedgerGuard.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = HttpStatusCode.BadRequest;

            // Decide status based on message (simple but effective)
            if (exception.Message.Contains("not found"))
                statusCode = HttpStatusCode.NotFound;

            if (exception.Message.Contains("Invalid credentials"))
                statusCode = HttpStatusCode.Unauthorized;

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                error = exception.Message
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}