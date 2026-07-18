using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Models;

namespace ArapcaSoruApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Question> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Arapça karakterler için utf8mb4 charset ve collation
            modelBuilder.HasCharSet("utf8mb4")
                        .UseCollation("utf8mb4_unicode_ci");

            modelBuilder.Entity<Question>(entity =>
            {
                // CourseName: max 200 karakter, zorunlu
                entity.Property(q => q.CourseName)
                      .HasMaxLength(200)
                      .IsRequired();

                // ExamType: max 100 karakter, zorunlu
                entity.Property(q => q.ExamType)
                      .HasMaxLength(100)
                      .IsRequired();

                // Year: zorunlu
                entity.Property(q => q.Year)
                      .IsRequired();

                // ImagePath: max 500 karakter, zorunlu
                entity.Property(q => q.ImagePath)
                      .HasMaxLength(500)
                      .IsRequired();

                // CorrectOption: tek karakter (A-E), zorunlu
                entity.Property(q => q.CorrectOption)
                      .HasMaxLength(1)
                      .IsRequired();

                // Hiyerarşik sorgular için bileşik index: Ders + Sınav Türü + Yıl
                entity.HasIndex(q => new { q.CourseName, q.ExamType, q.Year })
                      .HasDatabaseName("IX_Questions_Course_ExamType_Year");
            });
        }
    }
}
