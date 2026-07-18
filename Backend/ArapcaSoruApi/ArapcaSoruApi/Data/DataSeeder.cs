using ArapcaSoruApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ArapcaSoruApi.Data
{
    /// <summary>
    /// Uygulama başlangıcında veritabanı boşsa seed verilerini ekler.
    /// HasData yerine bu yaklaşım tercih edildi çünkü:
    ///   - GUID/otomatik artan ID'lerle çakışma olmaz
    ///   - Koşullu seeding (tablo doluysa ekleme) yapılabilir
    ///   - Migration bağımsız olarak yönetilebilir
    /// </summary>
    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Tablo zaten veri içeriyorsa seed etme
            if (await context.Questions.AnyAsync())
                return;

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Yaz Okulu | 2021 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            var questions = new List<Question>
            {
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2021/q1.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2021/q2.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2021/q3.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2021/q4.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2021/q5.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2021/q6.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2021/q7.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2021/q8.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2021/q9.png"  },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2021/q10.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2021/q11.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2021/q12.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2021/q13.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2021/q14.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2021/q15.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2021/q16.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2021/q17.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2021/q18.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2021/q19.png" },
                new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = 2021, CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2021/q20.png" },
            };

            await context.Questions.AddRangeAsync(questions);
            await context.SaveChangesAsync();
        }
    }
}
