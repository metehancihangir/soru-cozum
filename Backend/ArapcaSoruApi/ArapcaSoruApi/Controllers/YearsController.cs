using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Data;
using ArapcaSoruApi.Models;

namespace ArapcaSoruApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class YearsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public YearsController(AppDbContext context)
        {
            _context = context;
        }

        // ──────────────────────────────────────────────────────────────
        // GET /api/years
        // Tüm yılları (YearOptions + Questions tablosundaki mevcut yılları birleştirip sıralı döner)
        // ──────────────────────────────────────────────────────────────
        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> GetYears()
        {
            var dbYears = await _context.YearOptions.Select(y => y.Year).ToListAsync();
            var questionYears = await _context.Questions.Select(q => q.Year).Distinct().ToListAsync();

            var combined = dbYears.Concat(questionYears).Distinct().OrderBy(y => y).ToList();

            return Ok(combined);
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/years
        // Yeni yıl ekle (örn: "2027")
        // ──────────────────────────────────────────────────────────────
        [HttpPost]
        public async Task<IActionResult> CreateYear([FromBody] CreateYearRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Year))
                return BadRequest(new { error = "Yıl bilgisi boş olamaz." });

            var trimmedYear = request.Year.Trim();

            var exists = await _context.YearOptions.AnyAsync(y => y.Year == trimmedYear);
            if (!exists)
            {
                await _context.YearOptions.AddAsync(new YearOption { Year = trimmedYear });
                await _context.SaveChangesAsync();
            }

            return Ok(new { year = trimmedYear });
        }
    }

    public record CreateYearRequest(string Year);
}
