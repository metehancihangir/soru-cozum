using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Data;

namespace ArapcaSoruApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Connection string
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // DbContext kaydı
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            );

            // G-37, G-38, G-39, G-40: CORS politikası tanımı
            // Vite dev server port 5173 kullandığı için 3000 değil 5173 yazıldı
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

            // G-43: Swagger açıklaması ile yapılandırma
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

            // G-44: Swagger sadece development ortamında aktif
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

            // G-41: CORS middleware sırası kritik!
            // UseRouting → UseCors → UseAuthorization → MapControllers
            app.UseRouting();
            app.UseCors("AllowReactApp");
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
