using System.Collections.Concurrent;
using System.Text.Json;

namespace ArapcaSoruApi.Services
{
    /// <summary>
    /// Singleton kota izleme servisi.
    /// Günlük AI API istek sayısını takip eder, diske kaydeder ve API oran sınırlarını izler.
    /// </summary>
    public class QuotaTracker
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<QuotaTracker> _logger;
        private readonly string _filePath;

        private int _dailyCount;
        private string _currentDay;
        private bool _isRateLimited;
        private readonly object _lock = new();

        public QuotaTracker(IConfiguration configuration, ILogger<QuotaTracker> logger, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _logger        = logger;
            _filePath      = Path.Combine(env.ContentRootPath ?? Directory.GetCurrentDirectory(), "quota_store.json");
            _currentDay    = DateTime.UtcNow.ToString("yyyy-MM-dd");

            LoadFromDisk();
        }

        /// <summary>Konfigürasyondan günlük limit değerini okur.</summary>
        public int DailyLimit => _configuration.GetValue("AiSettings:DailyLimit", 1500);

        /// <summary>%80 uyarı eşiğini hesaplar.</summary>
        public int WarningThreshold => (int)(DailyLimit * 0.80);

        /// <summary>Günlük istek sayısını döner.</summary>
        public int DailyCount
        {
            get
            {
                ResetIfNewDay();
                return _dailyCount;
            }
        }

        /// <summary>Kalan kota miktarını döner.</summary>
        public int Remaining => Math.Max(0, DailyLimit - DailyCount);

        /// <summary>Kota %80 eşiğine ulaşıp ulaşmadığını döner.</summary>
        public bool IsNearLimit => DailyCount >= WarningThreshold || _isRateLimited;

        /// <summary>Kota tamamen dolmuş mu veya 429 alındı mı?</summary>
        public bool IsOverLimit => DailyCount >= DailyLimit || _isRateLimited;

        /// <summary>Bir istek kaydeder ve güncel durumu döner.</summary>
        public QuotaStatus RecordRequest()
        {
            ResetIfNewDay();

            int newCount;
            lock (_lock)
            {
                _dailyCount++;
                newCount = _dailyCount;
                SaveToDisk();
            }

            if (newCount == WarningThreshold)
            {
                _logger.LogWarning("⚠️ KOTA UYARISI: Günlük kota %80 eşiğine ulaştı ({Count}/{Limit}).", newCount, DailyLimit);
            }

            if (newCount >= DailyLimit)
            {
                _logger.LogCritical("🚨 KOTA DOLU: Günlük kota tamamen doldu ({Count}/{Limit}).", newCount, DailyLimit);
            }

            return GetStatus();
        }

        /// <summary>API tarafından 429 HTTP yanıtı alındığında çağrılır.</summary>
        public void MarkRateLimited()
        {
            lock (_lock)
            {
                _isRateLimited = true;
                SaveToDisk();
            }
            _logger.LogWarning("⚠️ Google API 429 (Rate Limit / Quota Exceeded) alındı. Kota dolu olarak işaretlendi.");
        }

        /// <summary>API başarılı yanıt verdiğinde rate limit işaretini kaldırır.</summary>
        public void ClearRateLimited()
        {
            lock (_lock)
            {
                if (_isRateLimited)
                {
                    _isRateLimited = false;
                    SaveToDisk();
                }
            }
        }

        /// <summary>Güncel kota durumunu döner.</summary>
        public QuotaStatus GetStatus()
        {
            ResetIfNewDay();
            int pct = DailyLimit > 0 ? (int)Math.Round((double)_dailyCount / DailyLimit * 100) : 0;
            if (_isRateLimited) pct = 100;

            string msg = _isRateLimited
                ? "Google Gemini API günlük/hız limitine ulaşıldı (HTTP 429). Kota gece 03:00 TSİ sıfırlanacaktır."
                : (pct >= 80 ? "Kota %80 eşiğine ulaştı." : "Kota durumu normal.");

            return new QuotaStatus
            {
                DailyCount    = _dailyCount,
                DailyLimit    = DailyLimit,
                Remaining     = _isRateLimited ? 0 : Remaining,
                IsNearLimit   = IsNearLimit,
                IsOverLimit   = IsOverLimit,
                IsRateLimited = _isRateLimited,
                Percentage    = Math.Min(pct, 100),
                ResetDate     = _currentDay,
                StatusMessage = msg,
            };
        }

        public bool ShouldUseFallback => IsNearLimit;

        private void ResetIfNewDay()
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            if (today == _currentDay) return;

            lock (_lock)
            {
                if (today != _currentDay)
                {
                    _logger.LogInformation("📊 Yeni gün. Günlük kota sıfırlandı. Dünkü toplam: {Count}/{Limit}", _dailyCount, DailyLimit);
                    _dailyCount = 0;
                    _isRateLimited = false;
                    _currentDay = today;
                    SaveToDisk();
                }
            }
        }

        private void LoadFromDisk()
        {
            try
            {
                if (File.Exists(_filePath))
                {
                    var json = File.ReadAllText(_filePath);
                    using var doc = JsonDocument.Parse(json);
                    var root = doc.RootElement;

                    var day = root.GetProperty("currentDay").GetString();
                    if (day == _currentDay)
                    {
                        _dailyCount = root.GetProperty("dailyCount").GetInt32();
                        if (root.TryGetProperty("isRateLimited", out var rl))
                        {
                            _isRateLimited = rl.GetBoolean();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Kota verisi disktenden okunamadı: {Error}", ex.Message);
            }
        }

        private void SaveToDisk()
        {
            try
            {
                var data = new
                {
                    currentDay = _currentDay,
                    dailyCount = _dailyCount,
                    isRateLimited = _isRateLimited
                };
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_filePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Kota verisi diske yazılamadı: {Error}", ex.Message);
            }
        }
    }

    /// <summary>Kota durumunu temsil eden DTO.</summary>
    public class QuotaStatus
    {
        public int    DailyCount    { get; set; }
        public int    DailyLimit    { get; set; }
        public int    Remaining     { get; set; }
        public bool   IsNearLimit   { get; set; }
        public bool   IsOverLimit   { get; set; }
        public bool   IsRateLimited { get; set; }
        public int    Percentage    { get; set; }
        public string ResetDate     { get; set; } = "";
        public string StatusMessage { get; set; } = "";
    }
}
