using System.Text;
using System.Text.Json;

namespace ArapcaSoruApi.Services
{
    /// <summary>
    /// Görsel tabanlı Yapay Zeka açıklama servisi.
    /// Verilen görseli Base64'e çevirir ve Gemini Vision API'sine göndererek açıklama üretir.
    /// Kota %80 eşiğine ulaştığında otomatik olarak fallback modele geçer.
    /// </summary>
    public class AiService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly QuotaTracker _quotaTracker;
        private readonly ILogger<AiService> _logger;

        // ── Birincil ve yedek modeller ──────────────────────────────────
        private const string PrimaryModel  = "gemini-2.5-flash";
        // Fallback: appsettings'ten okunur, yoksa gemini-2.0-flash kullanılır

        // Sistem istemi: Yapay zekanın nasıl davranacağını tanımlar
        // Görev 2.3 — Yeni standart format
        private const string SystemPrompt =
            "Rol ve Amaç:\n" +
            "Sen, pedagojik becerileri yüksek, uzman ve kullanıcı dostu bir eğitim asistanısın. " +
            "Temel görevin, sana iletilen soruları öğrencinin bilişsel yükünü en aza indirecek şekilde çözmektir. " +
            "Gereksiz detaylara girmeden, maksimum anlaşılırlıkla ve aşağıda belirtilen katı şablona kesinlikle sadık kalarak yanıt vermelisin.\n\n" +
            "Temel Kurallar:\n" +
            "- Odaklı İletişim: Açıklamaları asla gereksiz yere uzatma. Laf kalabalığından, didaktik tekrarlardan ve uzun paragraflardan kaçın. Sadece cevaba giden en net yolu göster.\n" +
            "- Okunabilirlik: Metinleri akıcı ve kullanıcı dostu bir dille yaz. Çözüm adımlarını, okumayı kolaylaştırmak için mutlaka kısa maddeler veya tek cümlelik satırlar halinde yapılandır.\n" +
            "- Format Bağlılığı: Çıktın SADECE aşağıdaki şablondan oluşmalıdır. Şablonun dışına çıkma, öncesine veya sonrasına ekstra bir selamlama/yorum ekleme.\n\n" +
            "Çıktı Şablonu (TAM OLARAK bu yapıyı kullan):\n\n" +
            "[Sorunun ne hakkında olduğuna dair 1-2 cümlelik genel açıklama]\n\n" +
            "**Çeviri:** [Soru metninin/kilit cümlelerin Türkçe çevirisi]\n\n" +
            "**Taktik:** [Soru tipine nasıl yaklaşılması gerektiğini anlatan, 1-2 cümlelik pratik strateji]\n\n" +
            "**A)** [A şıkkının açıklaması — neden doğru veya yanlış]\n" +
            "**B)** [B şıkkının açıklaması — neden doğru veya yanlış]\n" +
            "**C)** [C şıkkının açıklaması — neden doğru veya yanlış]\n" +
            "**D)** [D şıkkının açıklaması — neden doğru veya yanlış]\n" +
            "**E)** [E şıkkının açıklaması — neden doğru veya yanlış]\n\n" +
            "ÖNEMLİ: Her zaman A'dan E'ye tüm şıkları açıkla. Hiçbir şıkkı atlama. " +
            "Doğru şıkkın açıklamasını belirgin şekilde vurgula.";

        private readonly IWebHostEnvironment _env;

        public AiService(
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory,
            QuotaTracker quotaTracker,
            ILogger<AiService> logger,
            IWebHostEnvironment env)
        {
            _configuration     = configuration;
            _httpClientFactory = httpClientFactory;
            _quotaTracker      = quotaTracker;
            _logger            = logger;
            _env               = env;
        }

        /// <summary>
        /// Görseli analiz ederek yapay zeka açıklaması döner.
        /// Kota %80 eşiğindeyse otomatik olarak fallback modele geçer.
        /// </summary>
        public async Task<AiExplainResult> ExplainQuestionAsync(string imagePath, string correctOption)
        {
            // ── 1. API anahtarını yapılandırmadan al ────────────────────
            var apiKey = _configuration["AiSettings:GeminiApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "BURAYA_GEMINI_API_ANAHTARINIZI_GIRIN")
                throw new InvalidOperationException(
                    "Gemini API anahtarı girilmemiş. " +
                    "Lütfen appsettings.json dosyasındaki 'AiSettings:GeminiApiKey' alanını doldurun.");

            // ── 2. Kota kontrolü ────────────────────────────────────────
            var quotaStatus = _quotaTracker.RecordRequest();
            var useFallback = _quotaTracker.ShouldUseFallback;
            var fallbackModel = _configuration["AiSettings:FallbackModel"] ?? "gemini-2.0-flash";
            var modelToUse  = useFallback ? fallbackModel : PrimaryModel;

            if (useFallback)
            {
                _logger.LogWarning(
                    "Kota eşiği aşıldı ({Pct}%). Fallback model kullanılıyor: {Model}",
                    quotaStatus.Percentage, modelToUse);
            }

            // ── 3. Görseli yerel diskten (wwwroot) veya HTTP ile yükle ve Base64'e çevir
            byte[] imageBytes;
            string mimeType;

            var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var relativePath = imagePath.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
            var localFilePath = Path.Combine(webRoot, relativePath);

            if (File.Exists(localFilePath))
            {
                _logger.LogInformation("Görsel yerel yerel diskten okundu: {Path}", localFilePath);
                imageBytes = await File.ReadAllBytesAsync(localFilePath);
                var extension = Path.GetExtension(localFilePath).ToLowerInvariant();
                mimeType = extension switch
                {
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png"            => "image/png",
                    ".webp"           => "image/webp",
                    _                 => "image/png"
                };
            }
            else
            {
                var backendBaseUrl = _configuration["AiSettings:BackendBaseUrl"] ?? "https://soru-cozum-production.up.railway.app";
                var imageUrl       = $"{backendBaseUrl.TrimEnd('/')}/{imagePath.TrimStart('/')}";

                using (var imageClient = _httpClientFactory.CreateClient())
                {
                    var imageResponse = await imageClient.GetAsync(imageUrl);

                    if (!imageResponse.IsSuccessStatusCode)
                        throw new FileNotFoundException(
                            $"Görsel indirilemedi ({(int)imageResponse.StatusCode}): {imageUrl}");

                    imageBytes = await imageResponse.Content.ReadAsByteArrayAsync();

                    var contentType = imageResponse.Content.Headers.ContentType?.MediaType ?? "";
                    var extension   = Path.GetExtension(imagePath).ToLowerInvariant();

                    mimeType = contentType.StartsWith("image/") ? contentType : extension switch
                    {
                        ".jpg" or ".jpeg" => "image/jpeg",
                        ".png"            => "image/png",
                        ".webp"           => "image/webp",
                        _                 => "image/png"
                    };
                }
            }

            var base64Image = Convert.ToBase64String(imageBytes);

            // ── 4. Gemini API isteği ────────────────────────────────────
            string explanation;
            try
            {
                explanation = await CallGeminiAsync(apiKey, modelToUse, base64Image, mimeType, correctOption);
            }
            catch (HttpRequestException ex) when (useFallback == false)
            {
                // Birincil model başarısız olduysa fallback'i dene
                _logger.LogWarning(
                    "Birincil model ({Model}) başarısız oldu, fallback deneniyor: {Fallback}. Hata: {Error}",
                    PrimaryModel, fallbackModel, ex.Message);

                explanation = await CallGeminiAsync(apiKey, fallbackModel, base64Image, mimeType, correctOption);
                useFallback = true;
            }

            // ── 5. Format doğrulama ─────────────────────────────────────
            var isFormatValid = ValidateResponseFormat(explanation);
            if (!isFormatValid)
            {
                _logger.LogWarning(
                    "AI yanıtı beklenen formata uymuyor. Retry yapılıyor. Model: {Model}", modelToUse);

                // Bir kez daha dene
                try
                {
                    var retryExplanation = await CallGeminiAsync(apiKey, modelToUse, base64Image, mimeType, correctOption);
                    if (ValidateResponseFormat(retryExplanation))
                    {
                        explanation = retryExplanation;
                        isFormatValid = true;
                    }
                    else
                    {
                        _logger.LogWarning("Retry sonrası da format uyumsuz. Mevcut yanıt kullanılacak.");
                    }
                }
                catch (Exception retryEx)
                {
                    _logger.LogWarning("Format retry başarısız: {Error}", retryEx.Message);
                }
            }

            return new AiExplainResult
            {
                Explanation    = explanation,
                ModelUsed      = modelToUse,
                UsedFallback   = useFallback,
                QuotaStatus    = quotaStatus,
                IsFormatValid  = isFormatValid,
            };
        }

        /// <summary>
        /// Görseli analiz ederek sayfadaki soru bloklarının sınırlarını (bounding boxes) tespit eder.
        /// <summary>
        /// Görseli analiz ederek sayfadaki soru bloklarının gerçek soru numaralarını ve sınırlarını (bounding boxes) tespit eder.
        /// </summary>
        public async Task<List<QuestionBoxDetected>> DetectQuestionBoxesAsync(string base64Image, string mimeType)
        {
            var apiKey = _configuration["AiSettings:GeminiApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "BURAYA_GEMINI_API_ANAHTARINIZI_GIRIN")
                throw new InvalidOperationException("Gemini API anahtarı girilmemiş.");

            // Kota kaydı al
            _quotaTracker.RecordRequest();

            var modelToUse = PrimaryModel;

            // Bounding box + soru numarası tespiti için gelişmiş prompt
            var systemPrompt = 
                "Sen uzman bir sınav dokümanı ve görsel analiz asistanısın. Görevin, sana verilen sınav sayfası görselindeki ISTISNASIZ TÜM soruları ve bunlara ait şıkları tespit etmektir.\n\n" +
                "TETİKLEYİCİ VE SINIR KURALLARI:\n" +
                "1. GERÇEK SORU NUMARASI: Her soru bloğunun başındaki yazılı soru numarasını ('1', '2', '4', '12' gibi sadece sayıyı) tam ve doğru tespit et. Sayfanın soldan sağa sırasını değil, GÖRSELDEKİ GERÇEK SORU NUMARASINI esas al.\n" +
                "2. BAŞLANGIÇ (ymin): Her bir sorunun üst sınırı (ymin), soru numarasının hemen üstünden başlamalıdır.\n" +
                "3. BİTİŞ (ymax): Her sorunun alt sınırı (ymax), o soruya ait en son şıkkın (A, B, C, D, E) altını tamamen kapsayacak veya bir sonraki soru numarasının başladığı hizaya kadar eksiksiz uzanmalıdır.\n" +
                "4. YAN SINIRLAR (xmin, xmax): Sol ve sağ sınırlar, soru metnini ve şık alanlarını eksiksiz içine almalıdır.\n" +
                "5. ÇIKTI FORMATI: Sadece JSON array of objects dön. Her eleman `questionNumber` (string) ve `box` ([ymin, xmin, ymax, xmax]) içermelidir.\n\n" +
                "Örnek çıktı: [{\"questionNumber\":\"1\",\"box\":[100,50,250,450]},{\"questionNumber\":\"4\",\"box\":[100,500,250,950]}]";

            var requestBody = new
            {
                system_instruction = new { parts = new[] { new { text = systemPrompt } } },
                contents = new[]
                {
                    new
                    {
                        parts = new object[]
                        {
                            new { inline_data = new { mime_type = mimeType, data = base64Image } },
                            new { text = "Sayfadaki tüm soruların asıl numaralarını ve bounding box'larını JSON array olarak ver." }
                        }
                    }
                },
                generationConfig = new { temperature = 0.1, maxOutputTokens = 4096 }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var geminiClient = _httpClientFactory.CreateClient();
            string apiUrl = apiKey.StartsWith("AQ.", StringComparison.Ordinal)
                ? $"https://generativelanguage.googleapis.com/v1beta/models/{modelToUse}:generateContent"
                : $"https://generativelanguage.googleapis.com/v1beta/models/{modelToUse}:generateContent?key={apiKey}";
            
            if (apiKey.StartsWith("AQ.", StringComparison.Ordinal))
            {
                geminiClient.DefaultRequestHeaders.Add("x-goog-api-key", apiKey);
            }

            var response = await geminiClient.PostAsync(apiUrl, content);
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();

                if ((int)response.StatusCode == 429)
                {
                    // Fallback dene
                    var fallbackModel = _configuration["AiSettings:FallbackModel"] ?? "gemini-2.0-flash";
                    _logger.LogWarning("Birincil model 429 verdi. Fallback model deneniyor: {Model}", fallbackModel);

                    string fallbackUrl = apiKey.StartsWith("AQ.", StringComparison.Ordinal)
                        ? $"https://generativelanguage.googleapis.com/v1beta/models/{fallbackModel}:generateContent"
                        : $"https://generativelanguage.googleapis.com/v1beta/models/{fallbackModel}:generateContent?key={apiKey}";

                    using var fbContent = new StringContent(json, Encoding.UTF8, "application/json");
                    var fbResponse = await geminiClient.PostAsync(fallbackUrl, fbContent);

                    if (fbResponse.IsSuccessStatusCode)
                    {
                        response = fbResponse;
                    }
                    else
                    {
                        _quotaTracker.MarkRateLimited();
                        throw new InvalidOperationException("Gemini API dakikalık istek limitine (429) ulaşıldı. Lütfen 10-15 saniye bekleyip tekrar deneyin.");
                    }
                }
                else
                {
                    throw new HttpRequestException($"Gemini API hatası ({(int)response.StatusCode}): {errorBody}");
                }
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);

            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(text))
                return new List<QuestionBoxDetected>();

            // Clean up possible markdown json blocks
            text = text.Replace("```json", "").Replace("```", "").Trim();

            var results = new List<QuestionBoxDetected>();

            // 1. JSON Deserialize dene
            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var parsed = JsonSerializer.Deserialize<List<QuestionBoxDetectedJsonDto>>(text, options);
                if (parsed != null && parsed.Count > 0)
                {
                    foreach (var item in parsed)
                    {
                        if (item.Box != null && item.Box.Length == 4)
                        {
                            results.Add(new QuestionBoxDetected(item.QuestionNumber ?? "?", item.Box));
                        }
                    }
                    if (results.Count > 0) return results;
                }
            }
            catch { /* Fallback to regex */ }

            // 2. Regex Fallback: {"questionNumber":"4","box":[100,50,200,400]} veya genel kalıplar
            var regex = new System.Text.RegularExpressions.Regex(
                @"(?:questionNumber|num)""?\s*:\s*""?(\d+)""?.*?box""?\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline
            );

            var matches = regex.Matches(text);
            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                if (match.Groups.Count == 6)
                {
                    var qNum = match.Groups[1].Value;
                    var box = new int[] {
                        int.Parse(match.Groups[2].Value),
                        int.Parse(match.Groups[3].Value),
                        int.Parse(match.Groups[4].Value),
                        int.Parse(match.Groups[5].Value)
                    };
                    results.Add(new QuestionBoxDetected(qNum, box));
                }
            }

            // 3. Eğer numarasız sadece [ymin, xmin, ymax, xmax] geldiyse fallback
            if (results.Count == 0)
            {
                var boxRegex = new System.Text.RegularExpressions.Regex(@"\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]");
                var boxMatches = boxRegex.Matches(text);
                int idx = 1;
                foreach (System.Text.RegularExpressions.Match match in boxMatches)
                {
                    if (match.Groups.Count == 5)
                    {
                        results.Add(new QuestionBoxDetected(idx.ToString(), new int[] {
                            int.Parse(match.Groups[1].Value),
                            int.Parse(match.Groups[2].Value),
                            int.Parse(match.Groups[3].Value),
                            int.Parse(match.Groups[4].Value)
                        }));
                        idx++;
                    }
                }
            }

            return results;
        }

        /// <summary>
        /// Google API'nin canlı erişilebilirliğini 1 token'lık ping ile doğrular.
        /// HTTP 429 yanıtı alırsa QuotaTracker'ı otomatik günceller.
        /// </summary>
        public async Task CheckApiHealthAsync()
        {
            var apiKey = _configuration["AiSettings:GeminiApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "BURAYA_GEMINI_API_ANAHTARINIZI_GIRIN")
                return;

            try
            {
                var requestBody = new
                {
                    contents = new[] { new { parts = new[] { new { text = "ping" } } } },
                    generationConfig = new { maxOutputTokens = 1 }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                using var geminiClient = _httpClientFactory.CreateClient();
                string apiUrl = apiKey.StartsWith("AQ.", StringComparison.Ordinal)
                    ? $"https://generativelanguage.googleapis.com/v1beta/models/{PrimaryModel}:generateContent"
                    : $"https://generativelanguage.googleapis.com/v1beta/models/{PrimaryModel}:generateContent?key={apiKey}";

                if (apiKey.StartsWith("AQ.", StringComparison.Ordinal))
                {
                    geminiClient.DefaultRequestHeaders.Add("x-goog-api-key", apiKey);
                }

                var response = await geminiClient.PostAsync(apiUrl, content);
                if ((int)response.StatusCode == 429)
                {
                    _quotaTracker.MarkRateLimited();
                }
                else if (response.IsSuccessStatusCode)
                {
                    _quotaTracker.ClearRateLimited();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("API canlılık kontrolü başarısız: {Error}", ex.Message);
            }
        }

        /// <summary>Gemini API'ye istek gönderir ve yanıt metnini döner.</summary>
        private async Task<string> CallGeminiAsync(
            string apiKey, string model, string base64Image, string mimeType, string correctOption)
        {
            var requestBody = new
            {
                system_instruction = new
                {
                    parts = new[]
                    {
                        new { text = SystemPrompt }
                    }
                },
                contents = new[]
                {
                    new
                    {
                        parts = new object[]
                        {
                            new
                            {
                                inline_data = new
                                {
                                    mime_type = mimeType,
                                    data      = base64Image
                                }
                            },
                            new
                            {
                                text = $"Bu sorunun doğru cevabı {correctOption} şıkkıdır. " +
                                       "Önce doğru cevabın neden doğru olduğunu teyit et, " +
                                       "sonra çözüm adımlarını bu doğrultuda oluştur."
                            }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature     = 0.4,
                    maxOutputTokens = 4096
                }
            };

            var json    = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var geminiClient = _httpClientFactory.CreateClient();

            string apiUrl;
            if (apiKey.StartsWith("AQ.", StringComparison.Ordinal))
            {
                apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";
                geminiClient.DefaultRequestHeaders.Add("x-goog-api-key", apiKey);
            }
            else
            {
                apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";
            }

            var response = await geminiClient.PostAsync(apiUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();

                if ((int)response.StatusCode == 429)
                    throw new InvalidOperationException(
                        "API kota sınırına ulaşıldı. Lütfen birkaç saniye bekleyip tekrar deneyin.");

                throw new HttpRequestException(
                    $"Gemini API hatası ({(int)response.StatusCode}): {errorBody}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc    = JsonDocument.Parse(responseJson);

            var explanationText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return explanationText ?? "Yapay zekadan yanıt alınamadı.";
        }

        /// <summary>
        /// Yanıtın beklenen formata uyup uymadığını kontrol eder.
        /// En az A), B), C), D), E) şıklarının varlığını arar.
        /// </summary>
        private static bool ValidateResponseFormat(string response)
        {
            if (string.IsNullOrWhiteSpace(response)) return false;

            // Her şık için en az birinin mevcut olup olmadığını kontrol et
            var requiredPatterns = new[] { "**A)**", "**B)**", "**C)**", "**D)**", "**E)**" };
            // Alternatif format: A) B) C) D) E) (bold olmadan)
            var altPatterns      = new[] { "A)", "B)", "C)", "D)", "E)" };

            bool allBold = requiredPatterns.All(p => response.Contains(p, StringComparison.Ordinal));
            bool allPlain = altPatterns.All(p => response.Contains(p, StringComparison.Ordinal));

            return allBold || allPlain;
        }
    }

    /// <summary>AI açıklama sonucu — kota bilgisi dahil.</summary>
    public class AiExplainResult
    {
        public string      Explanation   { get; set; } = "";
        public string      ModelUsed     { get; set; } = "";
        public bool        UsedFallback  { get; set; }
        public QuotaStatus QuotaStatus   { get; set; } = new();
        public bool        IsFormatValid { get; set; } = true;
    }

    /// <summary>AI tarafından tespit edilen soru alanı ve numarası.</summary>
    public record QuestionBoxDetected(string QuestionNumber, int[] Box);

    /// <summary>JSON Deserialization için DTO</summary>
    public class QuestionBoxDetectedJsonDto
    {
        public string QuestionNumber { get; set; } = "?";
        public int[] Box { get; set; } = Array.Empty<int>();
    }
}
