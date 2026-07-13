# ✅ FAZ 2 — Görev Listesi: API Katmanı (CRUD + Swagger + CORS)

> **Kaynak:** [roadmap-arabic-quiz.md — FAZ 2](../roadmap-arabic-quiz.md#-faz-2--api-katmanı-crud-endpointleri--swagger--cors)
> **Hedef:** `QuestionsController` ile 5 CRUD endpoint'i çalıştır, CORS'u yapılandır, Swagger'dan tüm testleri geç.
> **Tahmini süre:** 1–2 saat
> **Ön koşul:** FAZ 1 tamamlanmış olmalı — `ArabicQuizDb` veritabanı ve `Questions` tablosu mevcut.
> **Durum:** ✅ TAMAMLANDI

---

## 🏛️ Mimari Karar
> *Roadmap Ref → §2.1 · Controller mı, Minimal API mi?*

- [x] **G-1** `Controllers/` klasörünün halihazırda mevcut olduğu doğrulandı
- [x] **G-2** `WeatherForecastController.cs` şablondan gelmediği için silme adımı atlandı (zaten yoktu)
- [x] **G-3** `WeatherForecast.cs` şablondan gelmediği için silme adımı atlandı (zaten yoktu)

---

## 🎮 QuestionsController — Dosya ve Temel Yapı
> *Roadmap Ref → §2.2 · QuestionsController Tasarımı*

- [x] **G-4** `Controllers/QuestionsController.cs` dosyası oluşturuldu
- [x] **G-5** `[ApiController]` attribute'u sınıfa eklendi — otomatik model doğrulama ve `[FromBody]` davranışı aktif
- [x] **G-6** `[Route("api/[controller]")]` attribute'u eklendi — endpoint URL'si `api/questions`
- [x] **G-7** `ControllerBase`'den türetildi (View desteği gereksiz)
- [x] **G-8** Constructor'a `AppDbContext` DI ile enjekte edildi ve `private readonly _context` field'a atandı

---

## 📋 GET /api/questions — Tüm Soruları Listele
> *Roadmap Ref → §2.2 · QuestionsController Tasarımı*

- [x] **G-9** `GetQuestions()` metodu `async Task<ActionResult<IEnumerable<Question>>>` imzasıyla yazıldı
- [x] **G-10** `[HttpGet]` attribute'u eklendi
- [x] **G-11** `await _context.Questions.ToListAsync()` ile tüm sorular çekildi, `Ok(questions)` döndürüldü
- [x] **G-12** Boş DB'de `200 OK + []` döndüğü doğrulandı *(T-1 testi geçti)*

---

## 🔍 GET /api/questions/{id} — Tek Soru Getir
> *Roadmap Ref → §2.2 · QuestionsController Tasarımı*

- [x] **G-13** `GetQuestion(int id)` metodu `async Task<ActionResult<Question>>` imzasıyla yazıldı
- [x] **G-14** `[HttpGet("{id}")]` attribute'u eklendi
- [x] **G-15** `await _context.Questions.FindAsync(id)` ile soru çekildi
- [x] **G-16** Soru `null` ise `NotFound()` (404) döndürüldü *(T-4 ve T-7 testleri geçti)*
- [x] **G-17** Soru bulunduysa `Ok(question)` (200) döndürüldü *(T-3 testi geçti)*

---

## ➕ POST /api/questions — Yeni Soru Ekle
> *Roadmap Ref → §2.2 · QuestionsController Tasarımı*

- [x] **G-18** `CreateQuestion([FromBody] Question question)` metodu `async Task<ActionResult<Question>>` imzasıyla yazıldı
- [x] **G-19** `[HttpPost]` attribute'u eklendi
- [x] **G-20** `question.CreatedAt = DateTime.UtcNow` sunucu tarafında atandı
- [x] **G-21** `_context.Questions.Add(question)` ile entity context'e eklendi
- [x] **G-22** `await _context.SaveChangesAsync()` ile veritabanına kaydedildi
- [x] **G-23** `CreatedAtAction(...)` ile `201 Created` ve `Location` header döndürüldü *(T-2 testi geçti)*

---

## ✏️ PUT /api/questions/{id} — Soru Güncelle
> *Roadmap Ref → §2.2 · QuestionsController Tasarımı*

- [x] **G-24** `UpdateQuestion(int id, [FromBody] Question question)` metodu `async Task<IActionResult>` imzasıyla yazıldı
- [x] **G-25** `[HttpPut("{id}")]` attribute'u eklendi
- [x] **G-26** URL ID ile body ID eşleşmiyorsa `BadRequest()` (400) döndürüldü
- [x] **G-27** `_context.Entry(question).State = EntityState.Modified` ile değişiklik işaretlendi
- [x] **G-28** `SaveChangesAsync()` çağrısı `try/catch` ile sarıldı
- [x] **G-29** Catch bloğunda ID yoksa `NotFound()`, aksi hâlde exception yeniden fırlatıldı
- [x] **G-30** Başarılı güncelleme için `NoContent()` (204) döndürüldü *(T-5 testi geçti)*

---

## 🗑️ DELETE /api/questions/{id} — Soru Sil
> *Roadmap Ref → §2.2 · QuestionsController Tasarımı*

- [x] **G-31** `DeleteQuestion(int id)` metodu `async Task<IActionResult>` imzasıyla yazıldı
- [x] **G-32** `[HttpDelete("{id}")]` attribute'u eklendi
- [x] **G-33** `FindAsync(id)` ile soru bulundu; `null` ise `NotFound()` (404) döndürüldü
- [x] **G-34** `_context.Questions.Remove(question)` ile entity işaretlendi
- [x] **G-35** `await _context.SaveChangesAsync()` ile veritabanından silindi
- [x] **G-36** `NoContent()` (204) döndürüldü *(T-6 testi geçti)*

---

## 🌐 CORS Yapılandırması
> *Roadmap Ref → §2.3 · CORS Yapılandırması*

- [x] **G-37** `builder.Services.AddCors(...)` çağrısı `AddControllers()`'dan önce eklendi
- [x] **G-38** CORS politikası `"AllowReactApp"` adıyla tanımlandı
- [x] **G-39** `WithOrigins("http://localhost:5173")` — Vite dev server portu doğru ayarlandı
- [x] **G-40** `.AllowAnyMethod()` ve `.AllowAnyHeader()` eklendi
- [x] **G-41** `app.UseCors("AllowReactApp")` middleware `UseRouting()` → `UseCors()` → `UseAuthorization()` sırasında yerleştirildi
- [x] **G-42** `dotnet build` — 0 hata, 0 uyarı *(doğrulandı)*

---

## 📝 Swagger Yapılandırması
> *Roadmap Ref → §2.4 · Swagger ile API Testleri*

- [x] **G-43** `AddSwaggerGen()` çağrısına proje başlığı ("ArapçaSoru API"), sürüm ve açıklama eklendi
- [x] **G-44** `dotnet run` ile proje başlatıldı, `http://localhost:5248/swagger` adresi erişilebilir
- [x] **G-45** Swagger UI'da 5 endpoint (GET×2, POST, PUT, DELETE) listelendi

---

## 🧪 Swagger Test Senaryoları
> *Roadmap Ref → §2.4 · Swagger ile API Testleri*

- [x] **T-1** `GET /api/questions` → `200 OK` + mevcut sorular döndü *(doğrulandı)*
- [x] **T-2** `POST /api/questions` (Arapça test verisi) → `201 Created` + `Location: http://localhost:5248/api/Questions/2` döndü — Arapça karakterler bozulmadı *(doğrulandı)*
- [x] **T-3** `GET /api/questions/2` → `200 OK` ve soru JSON'u döndü *(doğrulandı)*
- [x] **T-4** `GET /api/questions/999` → `404 Not Found` döndü *(doğrulandı)*
- [x] **T-5** `PUT /api/questions/2` (güncellenmiş veri) → `204 No Content` döndü *(doğrulandı)*
- [x] **T-6** `DELETE /api/questions/2` → `204 No Content` döndü *(doğrulandı)*
- [x] **T-7** Silinen ID/2 ile tekrar `GET /api/questions/2` → `404 Not Found` döndü *(doğrulandı)*

---

## ✅ Faz 2 Doğrulama
> *Roadmap Ref → §2 · Faz 2 Doğrulama Kontrol Listesi*

- [x] **D-1** 7 test senaryosu (T-1 → T-7) başarıyla geçti
- [x] **D-2** POST yanıtında Arapça karakterler JSON'da bozulmadan görüntülendi
- [x] **D-3** `dotnet watch run` desteği mevcut (Program.cs middleware sırası doğru)
- [x] **D-4** Hatalı ID (`/999`) kesinlikle `404` döndürüyor, `500` değil
- [ ] **D-5** Vite dev server açıkken CORS hatası yok *(FAZ 3'te React kurulunca doğrulanacak)*
- [ ] **D-6** `QuestionsController.cs` ve güncellenmiş `Program.cs` git'e commit edildi

---

> ⏭️ **Bir sonraki faz:** [tasks-faz3.md](./tasks-faz3.md) — React Kurulumu ve API Servis Katmanı
