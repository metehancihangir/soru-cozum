# 🗺️ ArapçaSoru — Full-Stack Geliştirme Yol Haritası

> **Teknoloji Yığını:** .NET Core Web API · Entity Framework Core · MySQL (utf8mb4) · React.js 18
>
> **Amaç:** Bu yol haritası seni sıfırdan çalışan bir uygulamaya götüren eğitici bir rehberdir. Kod yazmadan önce *neden* ve *nasıl* sorularına yanıt verir.

---

## 📌 Genel Mimari Bakış

Projeyi başlamadan önce büyük resmi görmek, sonraki kararlarını netleştirir:

```
[React Client :3000]
        │
        │  HTTP (JSON)
        ▼
[.NET Core Web API :5000]
        │
        │  EF Core (Pomelo Driver)
        ▼
[MySQL Database]
```

**Neden bu yığın?**
- **.NET Core Web API** → Strongly-typed, performanslı, Swagger desteği yerleşik
- **EF Core + Pomelo** → MySQL için olgun, migration destekli ORM; SQL yazmadan şema yönetimi
- **React 18** → useState/useEffect kancalarıyla bileşen tabanlı UI; yeniden kullanılabilir component'lar
- **MySQL utf8mb4** → Arapça karakterler 3 byte'ı aşabilir; utf8mb4 tüm Unicode'u destekler (utf8'in aksine)

---

## 🏗️ FAZ 1 — Backend Temeli
> **Hedef:** .NET Core projesi oluştur, EF Core ile MySQL'e bağlan, `Question` entity'sini modelle, ilk migration'ı çalıştır.
>
> ⏱ *Tahmini süre: 1–2 saat*

---

### 1.1 · Neden Önce Backend?

Frontend'i çalıştırmak için veri kaynağına ihtiyacın var. Backend'i önce kurmak sana Swagger üzerinden API'yi test etme imkânı verir; React'e geçmeden doğruluğunu kanıtlarsın.

### 1.2 · Proje Oluşturma

```bash
# Ana klasörü oluştur
mkdir ArabicQuizApp && cd ArabicQuizApp

# .NET Web API projesi oluştur (minimal API değil, controller tabanlı)
dotnet new webapi -n ArabicQuizAPI --no-https false
cd ArabicQuizAPI

# EF Core CLI araçlarını yükle (sadece bir kez, global)
dotnet tool install --global dotnet-ef

# Pomelo MySQL provider ve EF Core Design paketlerini ekle
dotnet add package Pomelo.EntityFrameworkCore.MySql --version 9.*
dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.*
```

> **💡 Öğretici Not — `--no-https false` neden?**
> Geliştirme ortamında HTTPS sertifika sorunları CORS ile çakışabilir. Şimdilik HTTP ile başlamak karmaşıklığı azaltır; production'da HTTPS tekrar açılır.

### 1.3 · `Question` Entity Modeli

**Dosya:** `Models/Question.cs`

**Neden `longtext`?** Arapça metinler değişken uzunluktadır; `varchar(255)` yeterli olmayabilir. `longtext` EF Core'da C#'taki `string` ile eşlenir ve MySQL'de 4 GB'a kadar Unicode metni saklar.

```
Id          → int, PK, auto-increment
QuestionText → string (longtext, utf8mb4)
OptionA–E   → string (longtext, utf8mb4) — E opsiyonel, nullable
CorrectOption → string maxLength(1) → "A", "B", "C", "D" veya "E"
Explanation → string (longtext) — yanlış cevapta gösterilecek açıklama
CreatedAt   → DateTime — kayıt tarihi, default: UtcNow
```

**Neden `CorrectOption` tek harfli string?** Doğru şıkkı "A","B","C" gibi saklamak, frontend'deki karşılaştırmayı `selectedOption === correctOption` kadar basit tutar.

### 1.4 · AppDbContext ve utf8mb4 Yapılandırması

**Dosya:** `Data/AppDbContext.cs`

**Neden DbContext?** EF Core'da DbContext; veritabanı bağlantısını, entity mapping'ini ve migration geçmişini yöneten merkezi sınıftır. Her tablo bir `DbSet<T>` olarak tanımlanır.

**Kritik Yapılandırma Noktaları:**
1. `OnModelCreating` içinde `collation = "utf8mb4_unicode_ci"` belirtmek — Arapça karakter sıralamasını doğru yapar
2. `HasCharSet("utf8mb4")` — Tüm sütunların encoding'ini zorlar

### 1.5 · Connection String ve appsettings.json

**Neden charset=utf8mb4 connection string'de de belirtilmeli?**
MySQL sürücüsü (Pomelo) bağlantıyı açarken encoding'i sunucuya bildirir. Hem veritabanı tarafında hem de sürücü tarafında belirtmek **çift güvence** sağlar; Arapça karakterlerin '???' olarak gelmesini önler.

```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;database=ArabicQuizDb;user=root;password=YOUR_PASS;charset=utf8mb4;"
}
```

### 1.6 · Program.cs — Servislerin Kaydı

**Neden `AddDbContext` `Program.cs`'de yapılır?**
.NET'in bağımlılık enjeksiyon (DI) konteyneri, Controller'lara `AppDbContext`'i otomatik enjekte edebilmesi için bu kaydı gerektirir. Bu mimari sayesinde Controller'lar `new AppDbContext()` çağırmaz; bağımlılıkları dışarıdan gelir (Dependency Injection prensibi).

```
Program.cs içinde şu sıraya dikkat et:
1. builder.Services.AddDbContext<AppDbContext>(...)
2. builder.Services.AddControllers()
3. CORS politikasını tanımla (Faz 2'de genişletilecek)
4. app.UseRouting() → app.UseCors() → app.MapControllers()
```

### 1.7 · EF Core Migration

```bash
# Migration dosyasını oluştur (veritabanına dokunmaz, sadece C# kodu üretir)
dotnet ef migrations add InitialCreate

# Veritabanını oluştur ve migration'ı uygula
dotnet ef database update
```

**Neden migration yaklaşımı?**
Migration; veritabanı şemasını kaynak kodu gibi versiyonlamana izin verir. `CREATE TABLE` SQL'i elle yazmak yerine C# modelini değiştirip yeni migration eklersin. Takım çalışmasında şema değişiklikleri git üzerinden izlenebilir.

### ✅ Faz 1 Doğrulama

- [ ] `dotnet build` hatasız tamamlanıyor
- [ ] MySQL'de `ArabicQuizDb` veritabanı ve `Questions` tablosu oluştu
- [ ] Tablonun `SHOW CREATE TABLE Questions;` çıktısında `utf8mb4` ve `utf8mb4_unicode_ci` görünüyor
- [ ] Manuel olarak MySQL Workbench/CLI'dan Arapça test verisi eklendiğinde karakter bozukluğu yok

---

## ⚙️ FAZ 2 — API Katmanı (CRUD Endpoint'leri + Swagger + CORS)
> **Hedef:** `QuestionsController` yaz, 5 endpoint'i çalıştır, CORS'u yapılandır, Swagger'dan test et.
>
> ⏱ *Tahmini süre: 1–2 saat*

---

### 2.1 · Mimari Karar: Controller mı, Minimal API mi?

Product Vision'da Controller tabanlı yaklaşım seçilmiş. Bu tercih doğru çünkü:
- **Organizasyon:** Her kaynak türü kendi Controller dosyasında → temiz klasör yapısı
- **Attribute Routing:** `[HttpGet]`, `[HttpPost]` gibi attribute'lar endpoint'leri açıkça belgeler
- **Genişletilebilirlik:** İleride eklenecek JWT Authentication ve Authorization filter'lar Controller tabanlı mimaride daha kolay uygulanır

### 2.2 · QuestionsController Tasarımı

**Dosya:** `Controllers/QuestionsController.cs`

**Neden `async/await`?**
Veritabanı I/O işlemleri (ağ çağrısı gibi) thread'i bloklar. `async Task<IActionResult>` ile .NET thread pool'u verimli kullanır; aynı anda çok sayıda isteği işleyebilir.

**5 Endpoint'in Mantığı:**

```
GET    /api/questions        → Tüm soruları dön (IEnumerable<Question>)
GET    /api/questions/{id}   → Tek soru; bulunamazsa 404
POST   /api/questions        → Yeni soru al, kaydet, 201 Created dön
PUT    /api/questions/{id}   → Var olan soruyu güncelle; bulunamazsa 404
DELETE /api/questions/{id}   → Sil; bulunamazsa 404
```

**Neden `[FromBody]`?**
POST ve PUT'ta React frontend JSON gönderir. `[FromBody]` attribute'u .NET'e "request body'yi JSON olarak deserialize et ve `Question` nesnesine dönüştür" der.

**HTTP Durum Kodlarının Önemi:**
- `200 OK` → Başarılı GET
- `201 Created` → Kayıt oluşturuldu; `Location` header'ında yeni kaynağın URL'si döner
- `204 No Content` → Başarılı PUT/DELETE; içerik yok
- `404 Not Found` → İstenen kayıt yok
- `400 Bad Request` → Geçersiz veri

### 2.3 · CORS Yapılandırması

**Neden CORS gerekli?**
Tarayıcı güvenlik politikası (Same-Origin Policy), `localhost:3000` adresindeki React'in `localhost:5000`'daki API'ye istek yapmasını **varsayılan olarak bloklar**. CORS (Cross-Origin Resource Sharing) bu engeli, sunucu tarafında açıkça izin vererek kaldırır.

```
Program.cs'de yapılandırma sırası kritiktir:
app.UseRouting();
app.UseCors("AllowReactApp");   ← UseRouting'den sonra, UseAuthorization'dan önce
app.UseAuthorization();
app.MapControllers();
```

**Güvenli CORS Politikası (development için):**
```
WithOrigins("http://localhost:3000")  ← Sadece React dev server
.AllowAnyMethod()
.AllowAnyHeader()
```

### 2.4 · Swagger ile API Testleri

`dotnet run` → Tarayıcıda `https://localhost:5000/swagger` aç

**Test Senaryoları:**

| # | İşlem | Beklenen Yanıt |
|---|-------|----------------|
| 1 | `GET /api/questions` (boş DB) | `[]` — boş JSON array |
| 2 | `POST /api/questions` (Arapça veri) | `201 Created`, Location header'ı |
| 3 | `GET /api/questions/{id}` | Eklenen soruyu gör |
| 4 | `GET /api/questions/999` | `404 Not Found` |
| 5 | `PUT /api/questions/{id}` | `204 No Content` |
| 6 | `DELETE /api/questions/{id}` | `204 No Content` |

**Arapça Karakter Test Verisi (POST body):**
```json
{
  "questionText": "ما معنى كلمة 'كتاب' في اللغة العربية؟",
  "optionA": "قلم",
  "optionB": "كتاب",
  "optionC": "مدرسة",
  "optionD": "بيت",
  "correctOption": "B",
  "explanation": "كلمة 'كتاب' تعني 'kitap' باللغة التركية."
}
```

**Swagger'dan gelen yanıtta Arapça karakterler `?` veya bozuk görünüyorsa:**
→ Connection string'de `charset=utf8mb4` var mı kontrol et
→ `appsettings.json` dosyasını UTF-8 (BOM'suz) olarak kaydet

### ✅ Faz 2 Doğrulama

- [ ] 6 test senaryosu Swagger'dan geçiyor
- [ ] Arapça karakterler JSON yanıtında bozulmuyor
- [ ] `dotnet watch run` ile hot reload çalışıyor
- [ ] Hatalı ID için 404 dönüyor

---

## ⚛️ FAZ 3 — React Kurulumu ve API Servis Katmanı
> **Hedef:** React projesini kur, `questionService.js` oluştur, API'den veri çek, console'da gör.
>
> ⏱ *Tahmini süre: 30 dakika–1 saat*

---

### 3.1 · Neden Ayrı Bir `services/` Katmanı?

**Kötü pratik:** Fetch çağrısını doğrudan component içine yazmak
```javascript
// QuestionCard.jsx içinde — YANLIŞ yaklaşım
fetch("http://localhost:5000/api/questions")  // URL her yerde tekrarlanır
```

**İyi pratik:** `services/questionService.js` katmanı
```javascript
// Tüm API iletişimi tek bir yerde → değiştirirken tek yer
const API_BASE = "http://localhost:5000/api";
export const getQuestions = () => fetch(`${API_BASE}/questions`).then(r => r.json());
```

Bu ayrım **Separation of Concerns** prensibinin uygulamasıdır: Component'lar *neyi göstereceklerini* bilir, *nereden getirdiklerini* değil.

### 3.2 · React Proje Kurulumu

```bash
# ArabicQuizApp klasörüne geri dön
cd ..
npx create-react-app arabic-quiz-client
cd arabic-quiz-client
npm start
```

**`package.json`'a proxy ekle — CORS'u kolaylaştırır:**
```json
"proxy": "http://localhost:5000"
```
Bu sayede `fetch("/api/questions")` yazabilirsin; CRA dev server isteği backend'e iletir. Production'da bu satır kaldırılır.

### 3.3 · `questionService.js` Tasarımı

**Dosya:** `src/services/questionService.js`

**Neden `async/await` + `try/catch`?**
Ağ hataları (API kapalı, timeout) runtime'da istisnası oluşturur. Bunu yakalamadan state'e geçmek uygulamayı çökertir. Her servis fonksiyonu kendi hatasını handle eder.

```javascript
// Mantık akışı:
// 1. fetch() → Promise döner
// 2. .json() → Response body'yi parse eder
// 3. Hata varsa throw → component catch eder
export const getQuestions = async () => { ... }
export const createQuestion = async (data) => { ... }
export const updateQuestion = async (id, data) => { ... }
export const deleteQuestion = async (id) => { ... }
```

### 3.4 · App.jsx — İlk Veri Çekimi

**`useEffect` neden gerekli?**
React bileşenleri render sırasında saf (pure) olmalıdır; yan etki (side effect) üretmemelidir. `useEffect(() => { ... }, [])` kancası, bileşen DOM'a mount olduktan *sonra* API çağrısını tetikler. `[]` bağımlılık dizisi "sadece ilk mount'ta çalış" anlamına gelir.

```javascript
// Durum akışı:
// mount → useEffect çalışır → getQuestions() → state güncellenir → re-render
const [questions, setQuestions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  getQuestions()
    .then(data => { setQuestions(data); setLoading(false); })
    .catch(err => { setError(err.message); setLoading(false); });
}, []);
```

### ✅ Faz 3 Doğrulama

- [ ] `npm start` → `http://localhost:3000` açılıyor
- [ ] Browser DevTools → Network tab → `GET /api/questions` 200 OK
- [ ] Console'da sorular JSON olarak görünüyor
- [ ] Backend kapalıyken hata mesajı ekranda görünüyor (crash değil)
- [ ] CORS hatası yok

---

## 🧩 FAZ 4 — Soru Bileşenleri ve Anlık Cevap Geri Bildirimi
> **Hedef:** `QuestionCard` ve `OptionButton` bileşenlerini yaz, useState ile anlık kırmızı/yeşil geri bildirimi çalıştır.
>
> ⏱ *Tahmini süre: 2–3 saat*

---

### 4.1 · Component Decomposition Stratejisi

Tek büyük bileşen yazmak yerine sorumlulukları böl:

```
App.jsx
  └── QuestionCard.jsx          ← Soru gösterimi + state yönetimi
        ├── [soru metni]         ← RTL div
        └── OptionButton.jsx     ← Her şık için ayrı bileşen (x4 veya x5)
              └── [renk durumu]  ← correct / wrong / default
```

**Neden `OptionButton` ayrı bir bileşen?**
Her şık aynı yapıyı paylaşır: metin + tıklama handler'ı + renk durumu. Bunu 5 kez copy-paste yapmak yerine tek bileşen prop'larla yönetilir.

### 4.2 · State Makinesi Tasarımı

Anlık geri bildirimin kalbi burada. Beş state birlikte tutarlı çalışmalı:

```
questions[]        → API'den gelen tüm soru listesi
currentIndex       → Hangi soruyu gösteriyoruz?
selectedOption     → Kullanıcı hangi şıkka tıkladı? (null = henüz tıklamadı)
isAnswered         → Tıklama gerçekleşti mi? (true → tüm şıklar disabled)
isCorrect          → Seçilen şık doğru mu? (renk mantığı için)
```

**State Geçiş Diyagramı:**

```
[Soru Gösteriliyor]
  selectedOption = null
  isAnswered = false
        │
        │ Şık tıklandı
        ▼
[handleOptionClick(option) çalışır]
  setSelectedOption(option)
  setIsAnswered(true)
  setIsCorrect(option === currentQuestion.correctOption)
        │
        ▼
[Geri Bildirim Gösteriliyor]
  isAnswered = true → tüm butonlar disabled
  seçilen şık: yeşil veya kırmızı
  yanlışsa: doğru şık yeşil, açıklama görünür
        │
        │ "Sonraki Soru" butonuna tıklandı
        ▼
[handleNextQuestion() çalışır]
  setCurrentIndex(prev => prev + 1)
  setSelectedOption(null)     ← sıfırla
  setIsAnswered(false)        ← sıfırla
  setIsCorrect(false)         ← sıfırla
```

**Neden `isAnswered` ayrı bir state?**
Sadece `selectedOption !== null` kontrolü yeterli değil mi? Hayır. `isAnswered` boolean'ı tüm butonları tek seferde `disabled` yapar ve "immutable answer" davranışını garantiler. Ayrıca açıklama metninin görünürlüğünü kontrol etmek için daha okunaklıdır.

### 4.3 · OptionButton Renk Mantığı

**Neden conditional className?**
CSS class'ları JavaScript koşullarıyla hesaplamak, React'in declarative paradigmasına uygundur. Inline style yerine class-based yaklaşım performans ve bakım açısından daha iyi.

```javascript
// Renk hesaplama mantığı:
const getButtonClass = () => {
  if (!isAnswered) return "option-btn";                         // Tıklanmadı → default
  if (option === correctOption) return "option-btn correct";    // Doğru şık → yeşil
  if (option === selectedOption) return "option-btn wrong";     // Seçilen yanlış → kırmızı
  return "option-btn";                                          // Diğerleri → değişmez
};
```

**Dikkat:** Yanlış şık seçildiğinde *hem* seçilen şık kırmızı *hem de* doğru şık yeşil yapılır. Bu, kullanıcının doğru cevabı görmesini sağlar.

### 4.4 · QuestionCard Bileşeni Anatomisi

```jsx
<div className="question-card">
  {/* RTL soru metni */}
  <div className="question-text rtl">
    {currentQuestion.questionText}
  </div>

  {/* Şıklar */}
  {["A","B","C","D","E"].map(letter => (
    currentQuestion[`option${letter}`] && (  // Boş şıkları atla (E opsiyonel)
      <OptionButton
        key={letter}
        option={letter}
        text={currentQuestion[`option${letter}`]}
        isAnswered={isAnswered}
        selectedOption={selectedOption}
        correctOption={currentQuestion.correctOption}
        onClick={() => handleOptionClick(letter)}
      />
    )
  ))}

  {/* Açıklama — sadece yanlış cevapta göster */}
  {isAnswered && !isCorrect && (
    <div className="explanation rtl">
      <strong>✅ Doğru Cevap: {currentQuestion.correctOption}</strong>
      <p>{currentQuestion.explanation}</p>
    </div>
  )}

  {/* Navigasyon */}
  {isAnswered && (
    <button onClick={handleNextQuestion}>
      {currentIndex < questions.length - 1 ? "Sonraki Soru →" : "Testi Bitir"}
    </button>
  )}
</div>
```

**Neden `currentQuestion[`option${letter}`]`?**
Bu dinamik property erişimi, 5 şık için tekrarlayan `if/switch` yazmadan E şıkkının boş olup olmadığını kontrol eder. JavaScript'in computed property access özelliğini kullanır.

### ✅ Faz 4 Doğrulama

- [ ] Şık tıklandığında renk değişimi çalışıyor
- [ ] Yanlış şık: kırmızı + doğru şık yeşil + açıklama görünüyor
- [ ] Doğru şık: sadece yeşil, açıklama yok
- [ ] Bir şık seçildikten sonra diğerleri tıklanamıyor (disabled)
- [ ] "Sonraki Soru" butonu tıklandığında state sıfırlanıyor
- [ ] Son soruda "Testi Bitir" metni görünüyor
- [ ] E şıkkı boş olan sorularda 4 şık görünüyor, 5 değil

---

## 🎨 FAZ 5 — RTL Entegrasyonu ve UI/UX Tasarımı
> **Hedef:** Arapça RTL CSS desteğini eksiksiz kur, responsive düzeni tamamla, görsel kaliteyi artır.
>
> ⏱ *Tahmini süre: 1–2 saat*

---

### 5.1 · RTL'nin CSS Temeli

**Neden `direction: rtl` yeterli değil?**
`direction: rtl` metnin akış yönünü değiştirir ama `text-align` varsayılanı hâlâ `left` kalabilir. Her ikisini birlikte belirtmek gerekir:

```css
.rtl {
  direction: rtl;
  text-align: right;
  font-family: 'Noto Naskh Arabic', serif;  /* Arapça font */
  unicode-bidi: bidi-override;               /* İç içe metin yönlerini düzelt */
}
```

**`unicode-bidi` neden gerekli?**
Soru metninde hem Arapça hem Türkçe kelimeler olabilir (örn: parantez içi açıklama). Tarayıcının Unicode Bidirectional Algorithm'ı karışık metin içinde yanlış kararlar verebilir. `unicode-bidi: embed` veya `bidi-override` bunu kontrol altına alır.

### 5.2 · CSS Yapısı — `index.css`

```css
/* ── Renk Tokenları ─────────────────────────── */
:root {
  --color-correct:  #22c55e;   /* yeşil — doğru şık */
  --color-wrong:    #ef4444;   /* kırmızı — yanlış şık */
  --color-default:  #3b82f6;   /* mavi — seçilmemiş şık */
  --color-disabled: #6b7280;   /* gri — cevap sonrası diğer şıklar */
}

/* ── Soru Kartı ──────────────────────────────── */
.question-card { ... }

/* ── RTL Metin Blokları ──────────────────────── */
.question-text.rtl { direction: rtl; text-align: right; }
.explanation.rtl   { direction: rtl; text-align: right; }

/* ── Şık Butonları ───────────────────────────── */
.option-btn { ... }
.option-btn.correct  { background: var(--color-correct); }
.option-btn.wrong    { background: var(--color-wrong); }
.option-btn:disabled { opacity: 0.65; cursor: not-allowed; }

/* ── Geçiş Animasyonları ─────────────────────── */
.option-btn { transition: background-color 0.25s ease; }
```

**Neden CSS değişkenleri (`:root` custom properties)?**
Renkleri tek yerde tanımlamak, Dark Mode eklemeni veya renk temasını değiştirmeni çok kolaylaştırır. İleride Dark Mode için sadece bir `[data-theme="dark"]` selector eklemeniz yeter.

### 5.3 · Arapça Font Yükleme

Google Fonts'tan **Noto Naskh Arabic** önerilir — Arapça harflerin doğru bağlanma (ligature) biçimlerini destekler:

```html
<!-- public/index.html <head> içine -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">
```

```css
.rtl {
  font-family: 'Noto Naskh Arabic', 'Arial Unicode MS', serif;
}
```

### 5.4 · Responsive Düzen

```css
/* Mobil öncelikli (mobile-first) yaklaşım */
.question-card {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Tablet ve üzeri */
@media (min-width: 768px) {
  .question-card { padding: 2.5rem; }
}
```

### 5.5 · Şık Harfi Etiketi (A, B, C, D)

RTL düzende şık harfi (A, B, C, D) sağ tarafta görünmeli, metin soldan başlamalı. Bu LTR/RTL karışımının tipik zorluk noktasıdır:

```css
.option-content {
  display: flex;
  flex-direction: row-reverse; /* RTL'de: harf sağda, metin solda */
  align-items: center;
  gap: 0.75rem;
}
.option-letter {
  font-weight: bold;
  min-width: 2rem;
  text-align: center;
  /* LTR olmalı — harf Arapça değil */
  direction: ltr;
}
.option-text {
  direction: rtl;
  flex: 1;
}
```

### ✅ Faz 5 Doğrulama

- [ ] Arapça metinler sağdan sola akıyor
- [ ] Şık harfleri (A, B, C, D) doğru konumda
- [ ] Mobilde (375px) butonlar üst üste binmiyor
- [ ] Renk değişimleri smooth animasyonla gerçekleşiyor
- [ ] Browser'ın "Page Source" incelendiğinde Arapça karakterler bozuk değil

---

## 🧪 FAZ 6 — Test ve Doğrulama
> **Hedef:** API, frontend ve Arapça karakter bütünlüğü için sistematik test senaryoları çalıştır.
>
> ⏱ *Tahmini süre: 1–2 saat*

---

### 6.1 · Backend API Testleri (Swagger / Postman)

**Swagger Avantajı:** Otomatik oluşturulan UI ile her endpoint'i test edebilir, request/response şemasını inceleyebilirsin.

**Kapsamlı Test Matrisi:**

| Test | Endpoint | Giriş | Beklenen Çıkış |
|------|----------|-------|----------------|
| T1 | GET /api/questions | — | 200, `[]` veya soru listesi |
| T2 | POST /api/questions | Geçerli Arapça soru | 201, `Location` header |
| T3 | POST /api/questions | `questionText` eksik | 400 Bad Request |
| T4 | GET /api/questions/{id} | Var olan ID | 200, tek soru |
| T5 | GET /api/questions/{id} | Olmayan ID (999) | 404 Not Found |
| T6 | PUT /api/questions/{id} | Güncellenmiş veri | 204 No Content |
| T7 | DELETE /api/questions/{id} | Var olan ID | 204 No Content |
| T8 | DELETE /api/questions/{id} | Silinmiş ID | 404 Not Found |

**Arapça Karakter Bütünlüğü — SQL Doğrulama:**
```sql
-- MySQL CLI veya Workbench'te çalıştır
SELECT Id, QuestionText FROM Questions WHERE Id = 1;
-- Arapça karakterler tam görünüyor mu?

-- Encoding kontrolü
SHOW VARIABLES LIKE 'character_set%';
-- character_set_server = utf8mb4 olmalı
```

### 6.2 · React Component Testleri

**React Testing Library ile temel senaryolar:**

```javascript
// QuestionCard.test.jsx
describe("Anlık Geri Bildirim", () => {
  test("Doğru şık seçilince yeşil CSS class eklenir", () => {
    // render → şık butonunu bul → tıkla → 'correct' class'ı ara
  });

  test("Yanlış şık seçilince kırmızı class eklenir + açıklama görünür", () => {
    // render → yanlış şık tıkla → 'wrong' class + explanation metin
  });

  test("Şık seçildikten sonra diğer butonlar disabled", () => {
    // tıklama sonrası tüm butonların disabled attribute'unu kontrol et
  });

  test("Sonraki Soru tıklandığında state sıfırlanır", () => {
    // handleNextQuestion → selectedOption null, isAnswered false
  });
});
```

**Manuel UI Test Kontrol Listesi:**
- [ ] 5 soru ekle; ilk, son ve ortadaki soruları test et
- [ ] Tüm şıkları (A'dan E'ye) sırayla doğru ve yanlış seç
- [ ] "Sonraki Soru" ardı ardına 5 kez → son soruda "Testi Bitir" görün
- [ ] Firefox, Chrome, Safari'de RTL düzeni test et
- [ ] Mobil simülatörde (DevTools 375px) testi tekrarla

### 6.3 · Arapça Karakter Bütünlüğü Kontrol Senaryoları

**Senaryo A — Round-trip Testi:**
1. Swagger'dan Arapça soru POST et
2. GET ile aynı soruyu geri çek
3. `questionText` değeri bire bir aynı mı? (Hexdump veya karakter sayısıyla karşılaştır)

**Senaryo B — Özel Karakter Testi:**
Arapça'nın zorlu karakterleri:
```
ة  ←  Ta Marbuta (küçük te)
ى  ←  Elif Maksura
ؤ  ←  Hemzeli vav
ئ  ←  Hemzeli ye
٫  ←  Arapça ondalık virgül
```
Bu karakterleri içeren bir soru oluşturup geri çek.

**Senaryo C — Hareke (Diacritic) Testi:**
```
كَتَبَ  ← Harekelihareke ile (fatḥa, kasra, ḍamma)
```
Harekeler ayrı Unicode code point'lerdir; utf8mb4 olmadan kaybolabilir.

### 6.4 · Performans Doğrulama

```
Browser DevTools → Network Tab:
- GET /api/questions → < 500ms (local'de beklenen)
- Response size: 100 soru için < 50KB (GZIP ile)

React DevTools → Profiler:
- Şık tıklandığında sadece OptionButton'lar re-render edilmeli
- QuestionCard'ın gereksiz re-render'ını kontrol et
```

### ✅ Faz 6 Doğrulama

- [ ] T1–T8 tüm API testleri geçti
- [ ] Round-trip testi başarılı (Arapça bozulmuyor)
- [ ] Component testleri geçiyor
- [ ] Mobil + masaüstü RTL düzeni doğru
- [ ] 100 soru sonrasında performans kabul edilebilir

---

## 🚀 Sonraki Adımlar (MVP Sonrası)

Projeyi bitirdikten sonra ilerlemek için önerilen sıra:

```
1. Sayfalama (Pagination)
   → GET /api/questions?page=1&size=10
   → React'te sayfa numarası state'i

2. Kategori Filtresi
   → Question entity'e Category alanı ekle
   → Dropdown filtre bileşeni

3. JWT Authentication
   → Admin paneli için login/logout
   → Bearer token ile korunan POST/PUT/DELETE

4. Kullanıcı Skor Takibi
   → Oturum başına doğru/yanlış sayacı
   → localStorage ile basit persistence

5. Dark Mode
   → CSS custom property + data-theme toggling
   → Sistem tercihini algıla (prefers-color-scheme)
```

---

## 📚 Başvuru Kaynakları

| Kaynak | URL | Konu |
|--------|-----|------|
| EF Core Docs | docs.microsoft.com/ef/core | Migration, DbContext |
| Pomelo MySQL | github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql | utf8mb4 config |
| React Docs | react.dev | useState, useEffect |
| RTL CSS | developer.mozilla.org/CSS/direction | direction, unicode-bidi |
| Noto Arabic | fonts.google.com/noto/specimen/Noto+Naskh+Arabic | Font |

---

> **🎓 Mentor Notu:** Bu yol haritasını takip ederken her faz sonunda çalışan bir ürün olmasına dikkat et. Faz 1 bittikten sonra veritabanında tablo var; Faz 2'de API yanıt veriyor; Faz 3'te React veri çekiyor... Her adım doğrulanabilir ve geri dönülebilir. Sorunlar oluştuğunda hangi faza ait olduğunu bilmek hata ayıklamayı çok kolaylaştırır.
