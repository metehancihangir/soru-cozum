using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Data;
using ArapcaSoruApi.Services;

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

            // CORS politikası — Tüm istemcilere izin ver (Firebase vs.)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            // Yapay Zeka servisi ve HTTP istemcisi kaydı
            builder.Services.AddHttpClient();
            builder.Services.AddScoped<AiService>();

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

            // Middleware sırası: UseRouting → UseCors → UseStaticFiles → UseAuthorization → MapControllers
            app.UseRouting();
            app.UseCors("AllowAll");
            app.UseStaticFiles();  // wwwroot/images → Frontend/public/images (junction)
            app.UseAuthorization();
            app.MapControllers();

            await app.RunAsync();
        }
    }
}
