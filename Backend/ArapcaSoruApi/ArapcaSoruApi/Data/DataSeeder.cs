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
            var questions = new List<Question>();

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Yaz Okulu | 2021 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Yaz Okulu" && q.Year == "2021"))
            {
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2021/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2021/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2021/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2021/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2021/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2021/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2021/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2021/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2021/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2021/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2021/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2021/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2021/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2021/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2021/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2021/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2021/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2021/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2021/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2021/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Yaz Okulu | 2022 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Yaz Okulu" && q.Year == "2022"))
            {
                // Answers for 2022: 1-A, 2-B, 3-E, 4-D, 5-B, 6-C, 7-E, 8-A, 9-B, 10-E, 11-D, 12-C, 13-A, 14-E, 15-A, 16-C, 17-D, 18-D, 19-C, 20-B.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2022/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2022/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2022/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2022/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2022/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2022/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2022/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2022/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2022/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2022/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2022/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2022/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2022/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2022/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2022/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2022/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2022/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2022/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2022/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2022/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Yaz Okulu | 2023 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Yaz Okulu" && q.Year == "2023"))
            {
                // Answers for 2023: 1-A, 2-B, 3-E, 4-A, 5-B, 6-D, 7-C, 8-D, 9-E, 10-A, 11-D, 12-D, 13-C, 14-C, 15-C, 16-B, 17-E, 18-A, 19-B, 20-E.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2023/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2023/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2023/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2023/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2023/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2023/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2023/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2023/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2023/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2023/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2023/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2023/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2023/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2023/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2023/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2023/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2023/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2023/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2023/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2023/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Yaz Okulu | 2024 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Yaz Okulu" && q.Year == "2024"))
            {
                // Answers for 2024: 1-E, 2-A, 3-B, 4-B, 5-E, 6-B, 7-E, 8-C, 9-D, 10-E, 11-A, 12-C, 13-D, 14-D, 15-A, 16-B, 17-C, 18-A, 19-C, 20-D.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2024/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2024/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2024/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2024/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2024/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2024/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2024/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2024/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2024/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2024/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2024/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2024/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2024/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2024/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2024/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2024/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2024/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2024/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2024/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2024/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Yaz Okulu | 2025 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Yaz Okulu" && q.Year == "2025"))
            {
                // Answers for 2025: 1-D, 2-A, 3-C, 4-B, 5-E, 6-D, 7-D, 8-C, 9-E, 10-E, 11-A, 12-B, 13-A, 14-E, 15-D, 16-B, 17-A, 18-B, 19-C, 20-C.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2025/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2025/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2025/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2025/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2025/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2025/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2025/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2025/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2025/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2025/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2025/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2025/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2025/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "E", ImagePath = "/images/arapca-2/yaz_okulu/2025/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "D", ImagePath = "/images/arapca-2/yaz_okulu/2025/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2025/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "A", ImagePath = "/images/arapca-2/yaz_okulu/2025/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "B", ImagePath = "/images/arapca-2/yaz_okulu/2025/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2025/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "C", ImagePath = "/images/arapca-2/yaz_okulu/2025/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Dönem Sonu | 2022 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Dönem Sonu" && q.Year == "2022"))
            {
                // Answers for 2022 Dönem Sonu: 1-B, 2-D, 3-E, 4-A, 5-C, 6-B, 7-A, 8-D, 9-C, 10-C, 11-B, 12-D, 13-C, 14-A, 15-D, 16-E, 17-A, 18-E, 19-B, 20-E.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2022/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2022/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2022/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2022/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2022/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2022/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2022/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2022/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2022/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2022/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2022/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2022/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2022/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2022/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2022/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2022/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2022/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2022/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2022/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2022/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Dönem Sonu | 2023-2024 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Dönem Sonu" && q.Year == "2023-2024"))
            {
                // Answers for 2023-2024 Dönem Sonu: 1-E, 2-B, 3-A, 4-C, 5-A, 6-E, 7-D, 8-C, 9-E, 10-E, 11-B, 12-A, 13-D, 14-B, 15-C, 16-A, 17-D, 18-C, 19-B, 20-D.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2023-2024/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Dönem Sonu | 2024-2025 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Dönem Sonu" && q.Year == "2024-2025"))
            {
                // Answers for 2024-2025 Dönem Sonu: 1-B, 2-E, 3-C, 4-A, 5-B, 6-E, 7-D, 8-D, 9-C, 10-A, 11-E, 12-A, 13-B, 14-D, 15-C, 16-E, 17-C, 18-A, 19-B, 20-D.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2024-2025/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-2 | Dönem Sonu | 2026 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            var existing2026 = await context.Questions.Where(q => q.CourseName == "Arapça-2" && q.ExamType == "Dönem Sonu" && q.Year == "2026").ToListAsync();
            if (existing2026.Any())
            {
                context.Questions.RemoveRange(existing2026);
                await context.SaveChangesAsync();
            }

            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-2" && q.ExamType == "Dönem Sonu" && q.Year == "2026"))
            {
                // Answers for 2026 Dönem Sonu: 1-C, 2-B, 3-D, 4-C, 5-A, 6-C, 7-D, 8-A, 9-A, 10-A, 11-D, 12-E, 13-C, 14-D, 15-B, 16-E, 17-B, 18-E, 19-B, 20-E.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2026/q1.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2026/q2.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2026/q3.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2026/q4.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2026/q5.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2026/q6.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2026/q7.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2026/q8.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2026/q9.png"  },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "A", ImagePath = "/images/arapca-2/donem_sonu/2026/q10.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2026/q11.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2026/q12.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "C", ImagePath = "/images/arapca-2/donem_sonu/2026/q13.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "D", ImagePath = "/images/arapca-2/donem_sonu/2026/q14.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2026/q15.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2026/q16.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2026/q17.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2026/q18.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "B", ImagePath = "/images/arapca-2/donem_sonu/2026/q19.png" },
                    new() { CourseName = "Arapça-2", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "E", ImagePath = "/images/arapca-2/donem_sonu/2026/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Yaz Okulu | 2021 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Yaz Okulu" && q.Year == "2021"))
            {
                // Answers for 2021 Arapça-4 Yaz Okulu: 1-E, 2-C, 3-A, 4-D, 5-A, 6-E, 7-E, 8-B, 9-C, 10-B, 11-E, 12-C, 13-D, 14-A, 15-D, 16-B, 17-D, 18-C, 19-A, 20-B.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2021/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2021/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2021/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2021/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2021/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2021/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2021/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2021/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2021/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2021/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2021/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2021/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2021/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2021/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2021/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2021/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2021/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2021/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2021/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2021", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2021/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Yaz Okulu | 2022 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Yaz Okulu" && q.Year == "2022"))
            {
                // Answers for 2022 Arapça-4 Yaz Okulu: 1-B, 2-B, 3-C, 4-D, 5-C, 6-E, 7-E, 8-A, 9-A, 10-C, 11-D, 12-E, 13-D, 14-B, 15-C, 16-E, 17-D, 18-A, 19-A, 20-B.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2022/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2022/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2022/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2022/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2022/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2022/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2022/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2022/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2022/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2022/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2022/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2022/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2022/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2022/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2022/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2022/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2022/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2022/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2022/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2022/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Yaz Okulu | 2023 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Yaz Okulu" && q.Year == "2023"))
            {
                // Answers for 2023 Arapça-4 Yaz Okulu: 1-A, 2-A, 3-D, 4-C, 5-D, 6-B, 7-E, 8-E, 9-D, 10-D, 11-A, 12-A, 13-B, 14-C, 15-C, 16-B, 17-B, 18-C, 19-E, 20-E.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2023/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2023/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2023/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2023/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2023/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2023/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2023/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2023/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2023/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2023/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2023/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2023/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2023/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2023/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2023/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2023/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2023/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2023/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2023/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2023", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2023/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Yaz Okulu | 2024 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Yaz Okulu" && q.Year == "2024"))
            {
                // Answers for 2024 Arapça-4 Yaz Okulu: 1-C, 2-C, 3-E, 4-E, 5-C, 6-B, 7-E, 8-D, 9-A, 10-A, 11-D, 12-B, 13-D, 14-A, 15-B, 16-A, 17-B, 18-D, 19-E, 20-C.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2024/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2024/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2024/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2024/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2024/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2024/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2024/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2024/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2024/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2024/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2024/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2024/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2024/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2024/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2024/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2024/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2024/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2024/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2024/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2024", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2024/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Yaz Okulu | 2025 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Yaz Okulu" && q.Year == "2025"))
            {
                // Answers for 2025 Arapça-4 Yaz Okulu: 1-A, 2-E, 3-C, 4-D, 5-E, 6-B, 7-A, 8-A, 9-E, 10-C, 11-C, 12-B, 13-B, 14-D, 15-A, 16-D, 17-D, 18-E, 19-C, 20-B.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2025/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2025/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2025/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2025/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2025/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2025/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2025/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2025/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2025/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2025/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2025/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2025/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2025/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2025/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "A", ImagePath = "/images/arapca-4/yaz_okulu/2025/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2025/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "D", ImagePath = "/images/arapca-4/yaz_okulu/2025/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "E", ImagePath = "/images/arapca-4/yaz_okulu/2025/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "C", ImagePath = "/images/arapca-4/yaz_okulu/2025/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Yaz Okulu", Year = "2025", CorrectOption = "B", ImagePath = "/images/arapca-4/yaz_okulu/2025/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Dönem Sonu | 2022 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Dönem Sonu" && q.Year == "2022"))
            {
                // Answers for 2022 Arapça-4 Dönem Sonu: 1-C, 2-A, 3-B, 4-B, 5-D, 6-E, 7-C, 8-C, 9-C, 10-B, 11-E, 12-B, 13-D, 14-A, 15-E, 16-E, 17-D, 18-A, 19-A, 20-D.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2022/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2022/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2022/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2022/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2022/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2022/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2022/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2022/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2022/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2022/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2022/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2022/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2022/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2022/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2022/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2022/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2022/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2022/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2022/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2022", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2022/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Dönem Sonu | 2023-2024 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Dönem Sonu" && q.Year == "2023-2024"))
            {
                // Answers for 2023-2024 Arapça-4 Dönem Sonu: 1-C, 2-D, 3-B, 4-B, 5-D, 6-C, 7-A, 8-C, 9-D, 10-E, 11-E, 12-C, 13-D, 14-E, 15-A, 16-B, 17-B, 18-E, 19-A, 20-B.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2023-2024", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2023-2024/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Dönem Sonu | 2024-2025 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Dönem Sonu" && q.Year == "2024-2025"))
            {
                // Answers for 2024-2025 Arapça-4 Dönem Sonu: 1-A, 2-C, 3-E, 4-D, 5-E, 6-D, 7-A, 8-C, 9-E, 10-D, 11-A, 12-D, 13-C, 14-B, 15-C, 16-E, 17-A, 18-B, 19-B, 20-B.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2024-2025", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2024-2025/q20.png" },
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // Arapça-4 | Dönem Sonu | 2026 — Cevap anahtarından okunan veriler
            // ─────────────────────────────────────────────────────────────────
            if (!await context.Questions.AnyAsync(q => q.CourseName == "Arapça-4" && q.ExamType == "Dönem Sonu" && q.Year == "2026"))
            {
                // Answers for 2026 Arapça-4 Dönem Sonu: 1-C, 2-B, 3-E, 4-D, 5-E, 6-A, 7-D, 8-C, 9-E, 10-C, 11-A, 12-A, 13-A, 14-D, 15-B, 16-B, 17-E, 18-C, 19-D, 20-B.
                questions.AddRange(new List<Question>
                {
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2026/q1.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2026/q2.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2026/q3.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2026/q4.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2026/q5.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2026/q6.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2026/q7.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2026/q8.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2026/q9.png"  },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2026/q10.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2026/q11.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2026/q12.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "A", ImagePath = "/images/arapca-4/donem_sonu/2026/q13.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2026/q14.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2026/q15.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2026/q16.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "E", ImagePath = "/images/arapca-4/donem_sonu/2026/q17.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "C", ImagePath = "/images/arapca-4/donem_sonu/2026/q18.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "D", ImagePath = "/images/arapca-4/donem_sonu/2026/q19.png" },
                    new() { CourseName = "Arapça-4", ExamType = "Dönem Sonu", Year = "2026", CorrectOption = "B", ImagePath = "/images/arapca-4/donem_sonu/2026/q20.png" },
                });
            }

            if (questions.Any())
            {
                await context.Questions.AddRangeAsync(questions);
                await context.SaveChangesAsync();
            }
        }
    }
}

