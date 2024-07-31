using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Task_Management.Api
{

    public class GlobalErrorHandler
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public GlobalErrorHandler(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async System.Threading.Tasks.Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private System.Threading.Tasks.Task HandleExceptionAsync(HttpContext httpContext, Exception ex)
        {
            var statusCode = DetermineStatusCode(ex);
            var environmentName = _configuration.GetValue<string>("ASPNETCORE_ENVIRONMENT");
            var errorDetail = new ExceptionErrorDetail
            {
                Code = (int)statusCode,
                Message = environmentName == "Development" ? ex.ToString() : "An unexpected error occurred."
            };

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)statusCode;

            var jsonResponse = JsonSerializer.Serialize(errorDetail);
            return httpContext.Response.WriteAsync(jsonResponse);
        }

        private HttpStatusCode DetermineStatusCode(Exception ex)
        {
            return ex switch
            {
                InvalidOperationException => HttpStatusCode.Forbidden,
                NotImplementedException => HttpStatusCode.NotImplemented,
                ArgumentNullException or ArgumentOutOfRangeException => HttpStatusCode.BadRequest,
                _ => HttpStatusCode.InternalServerError
            };
        }
    }

    public class ExceptionErrorDetail
    {
        public int Code { get; set; }
        public string? Message { get; set; }
    }

}
