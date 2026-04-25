using System;
using Microsoft.EntityFrameworkCore;
using LedgerGuard.API.Data;
using LedgerGuard.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LedgerGuard.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Adding Services to Scope for Dependency Injection
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<DisputeService>();
builder.Services.AddScoped<AdminService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Register DbContext with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(options =>
{
    //Define JWT Auth scheme in Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization", // Header name
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer", // MUST be lowercase
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    //Apply JWT globally to all endpoints
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });


var app = builder.Build();



// Automatically apply migrations when the app starts
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    int retries = 10;
    while (retries > 0)
    {
        try
        {
            Console.WriteLine("Attempting to migrate database...");
            dbContext.Database.Migrate();
            Console.WriteLine("Database migration successful!");
            Console.WriteLine("Attempting to insert seed data into database...");
            DbSeeder.Seed(dbContext);
            Console.WriteLine("Database insert seed data successful!");
            break;
        }
        catch (Exception ex)
        {
            retries--;
            Console.WriteLine($"Database not ready yet... Retrying ({retries})");
            Console.WriteLine($"Error: {ex.Message}");
            if (retries == 0)
            {
                throw; // Fail properly if all retries are exhausted
            }
            Thread.Sleep(3000); // wait 3 seconds
        }
    }
}


// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

// Enable Swagger in all environments (for demo / assignment purposes)
app.UseSwagger();
app.UseSwaggerUI();

// For error handling middleware
app.UseMiddleware<ExceptionMiddleware>();

// For CORS -> frontebd 
app.UseCors("AllowFrontend");

// addng authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
