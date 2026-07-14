using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Data;
using ArapcaSoruApi.Models;

namespace ArapcaSoruApi.Controllers
{
    // G-5: [ApiController] — otomatik model doğrulama + [FromBody] davranışı
    // G-6: [Route] — bu controller'ın URL'si api/questions olur
    // G-7: ControllerBase — View desteği gereksiz, sadece API
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        // G-8: AppDbContext constructor injection ile alınır
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        // ──────────────────────────────────────────────────────────────
        // G-9, G-10, G-11, G-12
        // GET /api/questions → Tüm soruları dön
        // Boş DB'de 404 değil 200 + [] döner
        // ──────────────────────────────────────────────────────────────
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            var questions = await _context.Questions.ToListAsync();
            return Ok(questions);
        }

        // ──────────────────────────────────────────────────────────────
        // G-13, G-14, G-15, G-16, G-17
        // GET /api/questions/{id} → Tek soru; bulunamazsa 404
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
        // G-18, G-19, G-20, G-21, G-22, G-23
        // POST /api/questions → Yeni soru ekle; 201 Created + Location header
        // ──────────────────────────────────────────────────────────────
        [HttpPost]
        public async Task<ActionResult<Question>> CreateQuestion([FromBody] Question question)
        {
            // G-20: Sunucu tarafında tarihi ata — istemciden gelen değere güvenme
            question.CreatedAt = DateTime.UtcNow;

            _context.Questions.Add(question);          // G-21
            await _context.SaveChangesAsync();          // G-22

            // G-23: 201 Created + Location: /api/questions/{id}
            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
        }

        // ──────────────────────────────────────────────────────────────
        // G-24, G-25, G-26, G-27, G-28, G-29, G-30
        // PUT /api/questions/{id} → Soru güncelle; 204 No Content
        // ──────────────────────────────────────────────────────────────
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] Question question)
        {
            // G-26: URL ID ile body ID eşleşmeli
            if (id != question.Id)
                return BadRequest();

            // G-27: Mevcut kaydı bul; bulunamazsa 404 dön
            var existing = await _context.Questions.FindAsync(id);
            if (existing == null)
                return NotFound();

            // Sadece güncellenmesi gereken alanları aktar;
            // CreatedAt istemciden gelen değere göre DEĞİŞTİRİLMEZ —
            // kayıt tarihinin üzerine yazmak bir veri bütünlüğü sorununa yol açar.
            existing.QuestionText = question.QuestionText;
            existing.OptionA      = question.OptionA;
            existing.OptionB      = question.OptionB;
            existing.OptionC      = question.OptionC;
            existing.OptionD      = question.OptionD;
            existing.OptionE      = question.OptionE;
            existing.CorrectOption = question.CorrectOption;
            existing.Explanation  = question.Explanation;
            // CreatedAt kasıtlı olarak güncellenmez

            // G-28, G-29: Eş zamanlı silme durumuna karşı try/catch
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Questions.AnyAsync(q => q.Id == id))
                    return NotFound();   // G-29: ID yoksa 404
                else
                    throw;               // G-29: Başka bir hata → yeniden fırlat
            }

            return NoContent(); // G-30: 204
        }

        // ──────────────────────────────────────────────────────────────
        // G-31, G-32, G-33, G-34, G-35, G-36
        // DELETE /api/questions/{id} → Sil; 204 No Content
        // ──────────────────────────────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id); // G-33

            if (question == null)
                return NotFound(); // G-33: null ise 404

            _context.Questions.Remove(question);   // G-34
            await _context.SaveChangesAsync();      // G-35

            return NoContent(); // G-36: 204
        }
    }
}
