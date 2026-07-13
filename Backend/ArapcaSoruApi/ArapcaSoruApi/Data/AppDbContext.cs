using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Models;

namespace ArapcaSoruApi.Data
{
    public class AppDbContext : DbContext
    {
        // G-16: DbContext'ten türetildi; constructor DI üzerinden options alıyor
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // G-17: Questions tablosunu temsil eden DbSet
        public DbSet<Question> Questions { get; set; }

        // G-18: Model yapılandırmaları burada tanımlanır
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // G-19 & G-20: Tüm model için utf8mb4 charset + utf8mb4_unicode_ci collation
            // Bu iki ayar Arapça karakterlerin doğru saklanmasını ve sıralanmasını garantiler
            modelBuilder.HasCharSet("utf8mb4")
                        .UseCollation("utf8mb4_unicode_ci");

            // G-21: CorrectOption alanı için ek Fluent API kısıtlamaları
            modelBuilder.Entity<Question>(entity =>
            {
                entity.Property(q => q.CorrectOption)
                      .HasMaxLength(1)
                      .IsRequired();
            });
        }
    }
}
