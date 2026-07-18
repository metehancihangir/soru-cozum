using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Data;

namespace ArapcaSoruApi
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Connection string
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // DbContext kaydı
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            );

            // CORS politikası — Vite dev server için
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "ArapçaSoru API",
                    Version = "v1",
                    Description = "Çıkmış Arapça Soruları Çözme Platformu — CRUD API"
                });
            });

            var app = builder.Build();

            // ── Uygulama başlarken migration uygula ve seed verilerini ekle ──
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Bekleyen migration varsa uygula
                await db.Database.MigrateAsync();

                // Tablo boşsa seed verilerini ekle
                await DataSeeder.SeedAsync(db);
            }

            // Swagger sadece development ortamında aktif
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ArapçaSoru API v1");
                });
            }

            // HTTPS kapalı (dev ortamı — CORS çakışmasını önler)
            // app.UseHttpsRedirection();

            // Middleware sırası: UseRouting → UseCors → UseAuthorization → MapControllers
            app.UseRouting();
            app.UseCors("AllowReactApp");
            app.UseAuthorization();
            app.MapControllers();

            await app.RunAsync();
        }
    }
}
