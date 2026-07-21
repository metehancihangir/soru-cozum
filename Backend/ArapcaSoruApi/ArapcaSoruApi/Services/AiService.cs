using System.Text;
using System.Text.Json;

namespace ArapcaSoruApi.Services
{
    /// <summary>
    /// Görsel tabanlı Yapay Zeka açıklama servisi.
    /// Verilen görseli Base64'e çevirir ve Gemini Vision API'sine göndererek açıklama üretir.
    /// </summary>
    public class AiService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        // Sistem istemi: Yapay zekanın nasıl davranacağını tanımlar
        private const string SystemPrompt =
            "Rol ve Amaç:\n" +
            "Sen, pedagojik becerileri yüksek, uzman ve kullanıcı dostu bir eğitim asistanısın. " +
            "Temel görevin, sana iletilen soruları öğrencinin bilişsel yükünü en aza indirecek şekilde çözmektir. " +
            "Gereksiz detaylara girmeden, maksimum anlaşılırlıkla ve aşağıda belirtilen katı şablona kesinlikle sadık kalarak yanıt vermelisin.\n\n" +
            "Temel Kurallar:\n" +
            "- Odaklı İletişim: Açıklamaları asla gereksiz yere uzatma. Laf kalabalığından, didaktik tekrarlardan ve uzun paragraflardan kaçın. Sadece cevaba giden en net yolu göster.\n" +
            "- Okunabilirlik: Metinleri akıcı ve kullanıcı dostu bir dille yaz. Çözüm adımlarını, okumayı kolaylaştırmak için mutlaka kısa maddeler veya tek cümlelik satırlar halinde yapılandır.\n" +
            "- Format Bağlılığı: Çıktın SADECE aşağıdaki şablondan oluşmalıdır. Şablonun dışına çıkma, öncesine veya sonrasına ekstra bir selamlama/yorum ekleme.\n\n" +
            "Çıktı Şablonu:\n" +
            "🎯 SORU TAKTİĞİ:\n" +
            "[Soru tipine nasıl yaklaşılması gerektiğini anlatan, öğrenciye zaman kazandıracak veya vizyon katacak, 1-2 cümlelik pratik bir strateji/ipucu yaz.]\n\n" +
            "📝 ADIM ADIM ÇÖZÜM:\n" +
            "[Adım 1: Çözüme giden ilk aşamanın net ve akıcı ifadesi.]\n" +
            "[Adım 2: Uygulanan mantık, işlem veya kuralın kısa açıklaması.]\n" +
            "[Gerekiyorsa diğer kısa adımlar...]\n\n" +
            "✅ DOĞRU CEVAP:\n" +
            "[Sadece doğru seçeneği veya sonucu yaz. Örn: C / 45 / Yalnız I]";

        public AiService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration     = configuration;
            _httpClientFactory = httpClientFactory;
        }

        /// <summary>
        /// Görseli analiz ederek yapay zeka açıklaması döner.
        /// </summary>
        /// <param name="imagePath">
        /// Soruya ait görselin göreli yolu (örn: "/images/arapca-2/yaz_okulu/2021/q1.png").
        /// Backend'in kendi URL'sinden HTTP ile çekilir; wwwroot bağımlılığı yoktur.
        /// </param>
        /// <returns>Yapay zekanın ürettiği açıklama metni.</returns>
        public async Task<string> ExplainQuestionAsync(string imagePath, string correctOption)
        {
            // ── 1. API anahtarını yapılandırmadan al ────────────────────────────────────────
            // API anahtarını appsettings.json içindeki "AiSettings:GeminiApiKey" alanından okur.
            // Anahtarı nasıl gireceğinizi görmek için appsettings.json dosyasına bakın.
            var apiKey = _configuration["AiSettings:GeminiApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "BURAYA_GEMINI_API_ANAHTARINIZI_GIRIN")
                throw new InvalidOperationException(
                    "Gemini API anahtarı girilmemiş. " +
                    "Lütfen appsettings.json dosyasındaki 'AiSettings:GeminiApiKey' alanını doldurun.");

            // ── 2. Görseli backend'in kendi URL'sinden çek ve Base64'e çevir ───────────────
            // Görseller /images/... yolu ile backend tarafından static file olarak sunulmaktadır.
            // IWebHostEnvironment.WebRootPath yerine HTTP ile çekiyoruz — bu daha güvenilirdir.
            var backendBaseUrl = _configuration["AiSettings:BackendBaseUrl"] ?? "https://soru-cozum-production.up.railway.app";
            var imageUrl       = $"{backendBaseUrl.TrimEnd('/')}/{imagePath.TrimStart('/')}";

            byte[] imageBytes;
            string mimeType;

            using (var imageClient = _httpClientFactory.CreateClient())
            {
                var imageResponse = await imageClient.GetAsync(imageUrl);

                if (!imageResponse.IsSuccessStatusCode)
                    throw new FileNotFoundException(
                        $"Görsel indirilemedi ({(int)imageResponse.StatusCode}): {imageUrl}");

                imageBytes = await imageResponse.Content.ReadAsByteArrayAsync();

                // Content-Type başlığından veya uzantıdan MIME tipini belirle
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

            var base64Image = Convert.ToBase64String(imageBytes);


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

            // ── 4. İsteği gönder ve yanıtı işle ────────────────────────────────────────────
            // AQ. formatı = Google AI Studio yeni nesil key → x-goog-api-key header ile gönderilir.
            // AIza... formatı = Eski nesil Gemini API key → ?key= query parametresi ile gönderilir.
            using var geminiClient = _httpClientFactory.CreateClient();

            string apiUrl;
            if (apiKey.StartsWith("AQ.", StringComparison.Ordinal))
            {
                // Google AI Studio yeni nesil key — x-goog-api-key header kullanılır
                apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
                geminiClient.DefaultRequestHeaders.Add("x-goog-api-key", apiKey);
            }
            else
            {
                // Eski nesil Gemini API key (AIzaSy...) — ?key= query parametresi kullanılır
                apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";
            }

            var response = await geminiClient.PostAsync(apiUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();

                // 429 = Kota aşımı — kullanıcıya özel mesaj göster
                if ((int)response.StatusCode == 429)
                    throw new InvalidOperationException(
                        "API kota sınırına ulaşıldı. Lütfen birkaç saniye bekleyip tekrar deneyin.");

                throw new HttpRequestException(
                    $"Gemini API hatası ({(int)response.StatusCode}): {errorBody}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc    = JsonDocument.Parse(responseJson);

            // Gemini yanıt yapısı: candidates[0].content.parts[0].text
            var explanationText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return explanationText ?? "Yapay zekadan yanıt alınamadı.";
        }
    }
}
