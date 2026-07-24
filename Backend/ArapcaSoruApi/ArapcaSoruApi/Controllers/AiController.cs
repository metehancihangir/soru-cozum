using Microsoft.AspNetCore.Mvc;
using ArapcaSoruApi.Services;

namespace ArapcaSoruApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly AiService _aiService;
        private readonly QuotaTracker _quotaTracker;

        public AiController(AiService aiService, QuotaTracker quotaTracker)
        {
            _aiService    = aiService;
            _quotaTracker = quotaTracker;
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/ai/explain
        // Body: { "imagePath": "/images/sorular/q1.jpg", "correctOption": "C" }
        // Soruya ait görseli yapay zekaya gönderir ve açıklama döner.
        // ──────────────────────────────────────────────────────────────
        [HttpPost("explain")]
        public async Task<IActionResult> Explain([FromBody] ExplainRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ImagePath))
                return BadRequest(new { error = "imagePath boş olamaz." });

            if (string.IsNullOrWhiteSpace(request.CorrectOption))
                return BadRequest(new { error = "correctOption boş olamaz." });

            try
            {
                var result = await _aiService.ExplainQuestionAsync(request.ImagePath, request.CorrectOption);
                return Ok(new
                {
                    explanation  = result.Explanation,
                    modelUsed    = result.ModelUsed,
                    usedFallback = result.UsedFallback,
                    quotaWarning = result.QuotaStatus.IsNearLimit
                        ? "Yoğunluk nedeniyle yedek model kullanılıyor. Yanıt kalitesi değişebilir."
                        : null,
                });
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
                // API anahtarı eksik veya kota aşımı
                if (ex.Message.Contains("kota", StringComparison.OrdinalIgnoreCase))
                {
                    return StatusCode(429, new
                    {
                        error   = "Şu anda yoğunluk nedeniyle hizmet veremiyoruz.",
                        detail  = "Lütfen birkaç dakika sonra tekrar deneyin.",
                        retryAfterSeconds = 60,
                    });
                }
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/ai/detect-boxes
        // Body: { "imageBase64": "...", "mimeType": "image/jpeg" }
        // Görseli yapay zekaya gönderir ve bounding box listesini döner.
        // ──────────────────────────────────────────────────────────────
        [HttpPost("detect-boxes")]
        public async Task<IActionResult> DetectBoxes([FromBody] DetectBoxesRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ImageBase64))
                return BadRequest(new { error = "imageBase64 boş olamaz." });

            var mimeType = string.IsNullOrWhiteSpace(request.MimeType) ? "image/jpeg" : request.MimeType;
            
            // Eğer Base64 data:image/... içeriyorsa temizle
            var base64Data = request.ImageBase64;
            if (base64Data.Contains(","))
            {
                base64Data = base64Data.Split(',')[1];
            }

            try
            {
                var boxes = await _aiService.DetectQuestionBoxesAsync(base64Data, mimeType);
                return Ok(new { boxes });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(429, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ──────────────────────────────────────────────────────────────
        // GET /api/ai/quota
        // Mevcut kota durumunu döner (admin/monitoring amaçlı).
        // ──────────────────────────────────────────────────────────────
        [HttpGet("quota")]
        public async Task<IActionResult> GetQuota()
        {
            await _aiService.CheckApiHealthAsync();
            var status = _quotaTracker.GetStatus();
            return Ok(status);
        }
    }

    /// <summary>POST /api/ai/explain istek gövdesi.</summary>
    public record ExplainRequest(string ImagePath, string CorrectOption);

    /// <summary>POST /api/ai/detect-boxes istek gövdesi.</summary>
    public record DetectBoxesRequest(string ImageBase64, string MimeType);
}
