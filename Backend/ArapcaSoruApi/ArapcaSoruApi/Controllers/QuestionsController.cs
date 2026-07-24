using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Data;
using ArapcaSoruApi.Models;

namespace ArapcaSoruApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        // ──────────────────────────────────────────────────────────────
        // GET /api/questions
        // Opsiyonel filtreler: ?courseName=Arapça-2&examType=Yaz Okulu&year=2021
        // ──────────────────────────────────────────────────────────────
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions(
            [FromQuery] string? courseName,
            [FromQuery] string? examType,
            [FromQuery] string? year)
        {
            var query = _context.Questions.AsQueryable();

            if (!string.IsNullOrWhiteSpace(courseName))
                query = query.Where(q => q.CourseName == courseName);

            if (!string.IsNullOrWhiteSpace(examType))
                query = query.Where(q => q.ExamType == examType);

            if (!string.IsNullOrWhiteSpace(year))
                query = query.Where(q => q.Year == year);

            var questions = await query.OrderBy(q => q.Id).ToListAsync();
            return Ok(questions);
        }

        // ──────────────────────────────────────────────────────────────
        // GET /api/questions/catalog
        // Veritabanında gerçekten soru bulunan Ders -> Sınav Türü -> Yıllar kataloğunu döner.
        // ──────────────────────────────────────────────────────────────
        [HttpGet("catalog")]
        public async Task<IActionResult> GetCatalog()
        {
            var raw = await _context.Questions
                .Select(q => new { q.CourseName, q.ExamType, q.Year })
                .Distinct()
                .ToListAsync();

            var result = raw
                .GroupBy(q => q.CourseName)
                .ToDictionary(
                    gCourse => gCourse.Key,
                    gCourse => gCourse
                        .GroupBy(q => q.ExamType)
                        .ToDictionary(
                            gExam => gExam.Key,
                            gExam => gExam.Select(q => q.Year).Distinct().OrderBy(y => y).ToList()
                        )
                );

            return Ok(result);
        }

        // ──────────────────────────────────────────────────────────────
        // GET /api/questions/{id}
        // ──────────────────────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            return Ok(question);
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/questions → Yeni soru ekle; 201 Created
        // ──────────────────────────────────────────────────────────────
        [HttpPost]
        public async Task<ActionResult<Question>> CreateQuestion([FromBody] Question question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
        }

        // ──────────────────────────────────────────────────────────────
        // PUT /api/questions/{id} → Soru güncelle; 204 No Content
        // ──────────────────────────────────────────────────────────────
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] Question question)
        {
            if (id != question.Id)
                return BadRequest();

            var existing = await _context.Questions.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.CourseName    = question.CourseName;
            existing.ExamType      = question.ExamType;
            existing.Year          = question.Year;
            existing.ImagePath     = question.ImagePath;
            existing.CorrectOption = question.CorrectOption;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Questions.AnyAsync(q => q.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // ──────────────────────────────────────────────────────────────
        // DELETE /api/questions/{id} → Sil; 204 No Content
        // ──────────────────────────────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id, [FromQuery] string? requesterUsername)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            _context.Questions.Remove(question);

            // Audit log
            await _context.AuditLogs.AddAsync(new AuditLog
            {
                AdminUsername = requesterUsername ?? "system",
                Action = "DELETE_QUESTION",
                Details = $"Deleted question ID {id} ({question.CourseName} - {question.ExamType} - {question.Year})"
            });

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/questions/upload-cropped
        // Form verisi veya Base64 olarak kırpılmış görsel ve metadata alır
        // ──────────────────────────────────────────────────────────────
        [HttpPost("upload-cropped")]
        public async Task<IActionResult> UploadCropped([FromBody] UploadCroppedQuestionRequest request, [FromServices] IWebHostEnvironment env)
        {
            if (string.IsNullOrWhiteSpace(request.ImageBase64))
                return BadRequest(new { error = "Görsel verisi boş olamaz." });

            if (string.IsNullOrWhiteSpace(request.CourseName) || string.IsNullOrWhiteSpace(request.ExamType) || string.IsNullOrWhiteSpace(request.Year))
                return BadRequest(new { error = "Ders, Sınav türü ve Yıl bilgileri zorunludur." });

            if (string.IsNullOrWhiteSpace(request.CorrectOption))
                return BadRequest(new { error = "Doğru seçenek zorunludur." });

            // Folder path oluştur
            string courseSlug = request.CourseName.ToLowerInvariant().Replace(" ", "_").Replace("ç", "c").Replace("ş", "s").Replace("ğ", "g").Replace("ü", "u").Replace("ö", "o").Replace("ı", "i");
            string examSlug   = request.ExamType.ToLowerInvariant().Replace(" ", "_").Replace("ç", "c").Replace("ş", "s").Replace("ğ", "g").Replace("ü", "u").Replace("ö", "o").Replace("ı", "i");
            string yearSlug   = request.Year.ToLowerInvariant().Replace(" ", "_");

            string relFolder = Path.Combine("images", courseSlug, examSlug, yearSlug).Replace("\\", "/");
            string webRoot = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            string targetDir = Path.Combine(webRoot, relFolder);

            if (!Directory.Exists(targetDir))
            {
                Directory.CreateDirectory(targetDir);
            }

            // Soru numarasını veya benzersiz adı belirle
            string filename = $"q_{DateTime.UtcNow.Ticks}_{Guid.NewGuid().ToString("N").Substring(0, 6)}.png";
            string filePath = Path.Combine(targetDir, filename);

            // Base64 verisini byte array'e çevir
            string base64Data = request.ImageBase64;
            if (base64Data.Contains(","))
            {
                base64Data = base64Data.Split(',')[1];
            }

            byte[] imageBytes = Convert.FromBase64String(base64Data);
            await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

            string imagePath = $"/{relFolder}/{filename}";

            // Question entity oluştur
            var question = new Question
            {
                CourseName = request.CourseName,
                ExamType = request.ExamType,
                Year = request.Year,
                ImagePath = imagePath,
                CorrectOption = request.CorrectOption.ToUpper(),
                Explanation = request.Explanation
            };

            await _context.Questions.AddAsync(question);

            // YearOption kaydını da güncelle
            if (!await _context.YearOptions.AnyAsync(y => y.Year == request.Year))
            {
                await _context.YearOptions.AddAsync(new YearOption { Year = request.Year });
            }

            // Audit log
            await _context.AuditLogs.AddAsync(new AuditLog
            {
                AdminUsername = request.AdminUsername ?? "system",
                Action = "CREATE_QUESTION_CROPPED",
                Details = $"Created cropped question {imagePath} for {request.CourseName} - {request.ExamType} - {request.Year}"
            });

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
        }
    }

    public record UploadCroppedQuestionRequest(
        string ImageBase64,
        string CourseName,
        string ExamType,
        string Year,
        string CorrectOption,
        string? Explanation,
        string? AdminUsername
    );
}
