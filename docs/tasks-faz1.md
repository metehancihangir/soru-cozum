# ✅ FAZ 1 — Görev Listesi: Backend Temeli

> **Kaynak:** [roadmap-arabic-quiz.md — FAZ 1](../roadmap-arabic-quiz.md#-faz-1--backend-temeli)
> **Hedef:** EF Core + MySQL bağlantısı, `Question` entity, ilk migration — `dotnet build` hatasız çalışıyor.
> **Tahmini süre:** 1–2 saat
> **Durum:** ✅ TAMAMLANDI

---

## 📦 Paket Kurulumu
> *Roadmap Ref → §1.2 · Proje Oluşturma*

- [x] **G-1** `dotnet-ef` CLI aracı global olarak kurulu mu kontrol et; kurulu değilse `dotnet tool install --global dotnet-ef` ile yükle
- [x] **G-2** `Pomelo.EntityFrameworkCore.MySql` (v8.x) paketini NuGet'ten projeye ekle
- [x] **G-3** `Microsoft.EntityFrameworkCore.Design` (v8.x) paketini NuGet'ten projeye ekle
- [x] **G-4** `dotnet build` komutunu çalıştır — paketler hatasız restore edilmeli

---

## 🗂️ Klasör & Dosya İskeleti
> *Roadmap Ref → §1.3 · Question Entity Modeli · §1.4 · AppDbContext*

- [x] **G-5** Proje kökünde `Models/` klasörünü oluştur
- [x] **G-6** Proje kökünde `Data/` klasörünü oluştur

---

## 🧩 Question Entity
> *Roadmap Ref → §1.3 · `Question` Entity Modeli*

- [x] **G-7** `Models/Question.cs` dosyasını oluştur
- [x] **G-8** `Id` alanını `int`, Primary Key, auto-increment olarak tanımla
- [x] **G-9** `QuestionText` alanını `string` (Required, `[Column(TypeName = "longtext")]`) olarak ekle
- [x] **G-10** `OptionA` ve `OptionB` alanlarını `string` (Required, longtext) olarak ekle
- [x] **G-11** `OptionC` ve `OptionD` alanlarını `string?` (nullable, longtext) olarak ekle
- [x] **G-12** `OptionE` alanını `string?` (nullable, longtext — beşinci şık opsiyonel) olarak ekle
- [x] **G-13** `CorrectOption` alanını `string` (Required, `[MaxLength(1)]`) olarak ekle — değer: "A"/"B"/"C"/"D"/"E"
- [x] **G-14** `Explanation` alanını `string?` (nullable, longtext) olarak ekle
- [x] **G-15** `CreatedAt` alanını `DateTime` olarak ekle; default değeri `DateTime.UtcNow` olacak şekilde ayarla

---

## 🗄️ AppDbContext (utf8mb4)
> *Roadmap Ref → §1.4 · AppDbContext ve utf8mb4 Yapılandırması*

- [x] **G-16** `Data/AppDbContext.cs` dosyasını oluştur; `DbContext`'ten türet
- [x] **G-17** `DbSet<Question> Questions` property'sini tanımla
- [x] **G-18** `OnModelCreating` override'ını yaz
- [x] **G-19** `OnModelCreating` içinde tüm modele `HasCharSet("utf8mb4")` uygula
- [x] **G-20** `OnModelCreating` içinde tüm modele `UseCollation("utf8mb4_unicode_ci")` uygula
- [x] **G-21** `Question` entity'sindeki `CorrectOption` kolonuna Fluent API ile `HasMaxLength(1)` ve `IsRequired()` ekle

---

## ⚙️ appsettings.json — Connection String
> *Roadmap Ref → §1.5 · Connection String ve appsettings.json*

- [x] **G-22** `appsettings.json` dosyasına `ConnectionStrings` bloğunu ekle
- [x] **G-23** Connection string değerine `charset=utf8mb4` parametresini dahil et
- [x] **G-24** `appsettings.json` dosyasındaki `YOUR_PASSWORD` değerini gerçek MySQL şifreyle değiştir

---

## 🔧 Program.cs — Servis Kaydı
> *Roadmap Ref → §1.6 · Program.cs — Servislerin Kaydı*

- [x] **G-25** `Program.cs`'e `using` direktiflerini ekle (`Pomelo`, `AppDbContext`)
- [x] **G-26** `builder.Services.AddDbContext<AppDbContext>()` çağrısını `AddControllers()`'dan **önce** ekle
- [x] **G-27** `UseMySql()` içinde `ServerVersion.AutoDetect(connectionString)` kullan
- [x] **G-28** `app.UseHttpsRedirection()` satırını geliştirme ortamı için comment out et

---

## 🚀 EF Core Migration
> *Roadmap Ref → §1.7 · EF Core Migration*

- [x] **G-29** `dotnet ef migrations add InitialCreate` komutunu çalıştır — `Migrations/` klasörü ve iki dosya oluşmalı
- [x] **G-30** Oluşan migration dosyasını incele; tüm kolonlarda `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci` doğrulandı
- [x] **G-31** `dotnet ef database update` komutunu çalıştır — `ArabicQuizDb` veritabanı ve `Questions` tablosu oluştu

---

## ✅ Faz 1 Doğrulama
> *Roadmap Ref → §1 · Faz 1 Doğrulama Kontrol Listesi*

- [x] **D-1** `dotnet build` komutu hata olmadan tamamlanıyor *(0 hata, 0 uyarı — doğrulandı)*
- [x] **D-2** `ArabicQuizDb` veritabanı MySQL'de oluşturuldu *(database update çıktısından doğrulandı)*
- [x] **D-3** `Questions` tablosu `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci` ile oluşturuldu *(migration SQL çıktısından doğrulandı)*
- [ ] **D-4** MySQL'den elle `INSERT` ile Arapça metin (`كتاب`) eklendiğinde `SELECT` sorgusunda karakterler bozulmadan görünüyor *(manuel kontrol)*
- [ ] **D-5** `Migrations/` klasörü git'e commit edildi

---

> ⏭️ **Bir sonraki faz:** [tasks-faz2.md](./tasks-faz2.md) — API Katmanı (CRUD + Swagger + CORS)
