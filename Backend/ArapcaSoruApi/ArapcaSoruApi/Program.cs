using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Data;

namespace ArapcaSoruApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // G-25 & G-26: Connection string'i oku ve AppDbContext'i DI konteynerine kaydet
            // AddDbContext, Controller'lara AppDbContext'i constructor injection ile sağlar
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<AppDbContext>(options =>
                // G-27: ServerVersion.AutoDetect — MySQL sürümünü otomatik algılar
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            );

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // G-28: Geliştirme ortamında HTTPS yönlendirmesini devre dışı bırak
            // CORS + dev sertifika çakışmasını önler; production'da tekrar açılır
            // app.UseHttpsRedirection();

            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
