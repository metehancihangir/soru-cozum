using Microsoft.AspNetCore.Mvc;
using ArapcaSoruApi.Services;

namespace ArapcaSoruApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly AiService _aiService;

        public AiController(AiService aiService)
        {
            _aiService = aiService;
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/ai/explain
        // Body: { "imagePath": "/images/sorular/q1.jpg" }
        // Soruya ait görseli yapay zekaya gönderir ve açıklama döner.
        // ──────────────────────────────────────────────────────────────
        [HttpPost("explain")]
        public async Task<IActionResult> Explain([FromBody] ExplainRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ImagePath))
                return BadRequest(new { error = "imagePath boş olamaz." });

            try
            {
                var explanation = await _aiService.ExplainQuestionAsync(request.ImagePath);
                return Ok(new { explanation });
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new { error = "Yapay zeka servisine ulaşılamadı.", detail = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                // API anahtarı eksik
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    /// <summary>POST /api/ai/explain istek gövdesi.</summary>
    public record ExplainRequest(string ImagePath);
}
