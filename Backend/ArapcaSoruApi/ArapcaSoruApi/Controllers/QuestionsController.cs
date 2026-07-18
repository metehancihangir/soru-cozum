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
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
