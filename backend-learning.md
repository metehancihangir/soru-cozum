# Backend (Arka Uç) Öğrenme Rehberi

Bu rehber, projenin **Backend (.NET API)** kısmındaki her bir klasörün ve dosyanın ne işe yaradığını, projeye katkısını ve bunlarla senin ne kadar ilgilenmen gerektiğini (senin için gerekli olup olmadığını) açıklamak için hazırlandı.

Projenin backend ana dizini: `Backend/ArapcaSoruApi/ArapcaSoruApi`

---

## 1. `Models/` (Modeller Klasörü)
* **İçerik:** `Question.cs` dosyası bulunur.
* **Ne İşe Yarar?:** Veritabanında tutacağımız verilerin şablonunu (taslağını) belirler. Uygulamanın beynindeki "Kavramları" tanımladığımız yerdir.
* **Projeye Katkısı:** Veritabanındaki tablonun hangi sütunlardan oluşacağını (Id, Ders Adı, Yıl, Resim Yolu vs.) ve bu sütunların kurallarını (zorunlu mu, kaç karakter vs.) burası belirler.
* **Senin İçin Gerekli mi?:** **Evet, kesinlikle.** Projeye yeni bir özellik eklemek istersen (örneğin soruya "Zorluk Derecesi" eklemek) ilk değiştireceğin yer burasıdır.
* **Öğrenmen Gereken Terimler:**
  * **Entity (Varlık):** Veritabanındaki bir satır veriyi temsil eden kod sınıfı (class) demektir. `Question` bir entity'dir.
  * **Property (Özellik):** Entity içindeki her bir değişkendir (Örn: `CourseName`, `Year`). Sütunları temsil eder.

---

## 2. `Data/` (Veri Klasörü)
* **İçerik:** `AppDbContext.cs` ve `DataSeeder.cs`
* **Ne İşe Yarar?:** Veritabanı ile C# kodumuz arasındaki köprüdür. Kodların veritabanıyla konuşmasını sağlar.
* **Projeye Katkısı:**
  * `AppDbContext.cs`: MySQL bağlantısını kurar, tabloları oluşturur ve Arapça karakter desteği (utf8mb4) gibi hayati ayarları yapar.
  * `DataSeeder.cs`: Proje ilk çalıştığında veritabanı boş olmasın diye içine otomatik olarak yüzlerce test sorusunu ve cevap anahtarını basan (tohumlayan) dosyadır.
* **Senin İçin Gerekli mi?:** **Kısmen.** `DataSeeder` dosyasını yeni sorular eklemek için kopyala-yapıştır ile kullanabilirsin. Ancak `AppDbContext` bir kere kurulur ve genelde pek dokunulmaz.
* **Öğrenmen Gereken Terimler:**
  * **DbContext:** Veritabanını temsil eden ana sınıftır. Tüm "Kaydet", "Sil", "Güncelle" işlemleri bu sınıf üzerinden veritabanına iletilir.
  * **Seeding (Tohumlama):** Veritabanına başlangıç için otomatik varsayılan veriler (test verileri) ekleme işlemidir.

---

## 3. `Controllers/` (Kontrolcüler Klasörü)
* **İçerik:** `QuestionsController.cs`
* **Ne İşe Yarar?:** Dış dünyadan (örneğin React yani Frontend'den) gelen siparişleri/istekleri karşılayan resepsiyondur.
* **Projeye Katkısı:** Frontend'in veritabanına doğrudan erişmesini engeller. Araya bir güvenlik duvarı ve mantık katmanı koyar. Örneğin, Frontend "Soruları getir" der, Controller bu isteği alır, `AppDbContext`'e gidip soruları çeker ve Frontend'e geri yollar.
* **Senin İçin Gerekli mi?:** **Evet.** Eğer ileride "Sadece yanlış yapılan soruları getir" gibi yeni bir özellik (URL) eklemek istersen kodunu buraya yazacaksın.
* **Öğrenmen Gereken Terimler:**
  * **Endpoint (Uç Nokta):** İnternet tarayıcısında veya kodda istek atılan spesifik URL'dir (Örn: `/api/questions`).
  * **HTTP Metotları:** GET (Veri oku/getir), POST (Yeni veri ekle), PUT (Veriyi güncelle), DELETE (Veriyi sil).

---

## 4. `Migrations/` (Göçler / Veritabanı Sürümleri Klasörü)
* **İçerik:** `20260718..._ChangeYearToString.cs` gibi uzun tarihli dosyalar.
* **Ne İşe Yarar?:** Veritabanının zaman içindeki değişim kaydıdır (versiyon geçmişi).
* **Projeye Katkısı:** Sen `Models/Question.cs` dosyasında bir değişiklik yaptığında (örneğin yeni bir sütun eklediğinde), sistem "Veritabanına git ve o sütunu ekle" diyen otomatik bir dosya oluşturur. İşte o dosyalar burada tutulur.
* **Senin İçin Gerekli mi?:** **Hayır.** Bu dosyaları senin elle yazmana veya değiştirmene gerek yoktur, kodlama araçları (Terminal komutları) bunları senin yerine otomatik üretir. Sen sadece komut çalıştırırsın.

---

## 5. `Properties/` (Özellikler/Ayarlar Klasörü)
* **İçerik:** `launchSettings.json`
* **Ne İşe Yarar?:** Projeyi kendi bilgisayarında (lokalde) "Çalıştır" (Run) butonuna bastığında API'nin hangi portta (örn: `localhost:5000`) açılacağını belirler.
* **Projeye Katkısı:** Geliştirme yaparken sistemin nasıl ayağa kalkacağının kurallarını içerir.
* **Senin İçin Gerekli mi?:** **Hayır.** Genelde projenin başında bir kez ayarlanır ve bir daha yüzüne bakılmaz.

---

## 6. Ana Dizin Dosyaları (Root Files)

### `Program.cs`
* **Ne İşe Yarar?:** Uygulamanın kalbidir ve **çalışmaya başladığı ilk noktadır**.
* **Projeye Katkısı:** Uygulama ayağa kalkarken hangi servisleri kullanacağını (Örn: "MySQL kullanacağım", "React'in bana bağlanmasına izin vereceğim - CORS") burada sisteme tanıtırız.
* **Senin İçin Gerekli mi?:** **Orta Derece.** Eğer projeye yeni bir şifreleme sistemi, yeni bir veritabanı türü veya dışarıdan bir paket (kütüphane) eklersen buraya bir satır kod yazman gerekebilir.

### `appsettings.json` ve `appsettings.Development.json`
* **Ne İşe Yarar?:** Uygulamanın yapılandırma (ayar) dosyalarıdır. Şifreler, bağlantı yolları burada düz metin olarak tutulur.
* **Projeye Katkısı:** MySQL veritabanına bağlanmak için gereken `Connection String` (Bağlantı Cümlesi - Kullanıcı adı, şifre, sunucu adresi) burada bulunur.
* **Senin İçin Gerekli mi?:** **Evet.** Projeyi başka bir bilgisayarda açtığında veya canlıya (internete) aldığında veritabanı şifrelerini bu dosyadan değiştirmen gerekecek.

### `ArapcaSoruApi.csproj`
* **Ne İşe Yarar?:** Projenin kimlik kartıdır.
* **Projeye Katkısı:** Uygulamanın hangi .NET sürümünde çalıştığını ve dışarıdan indirdiğimiz kod paketlerini (Nuget Paketleri - örn: Entity Framework Core MySQL paketi) listeler.
* **Senin İçin Gerekli mi?:** **Hayır.** Sen terminalden veya arayüzden projeye yeni bir eklenti kurduğunda bu dosya otomatik güncellenir, elle düzenlemene gerek yoktur.

### `bin/` ve `obj/` Klasörleri
* **Ne İşe Yarar?:** C# kodları bilgisayarın anlayacağı makine diline çevrildiğinde oluşan geçici ve derlenmiş dosyalardır.
* **Senin İçin Gerekli mi?:** **Kesinlikle Hayır.** Bu klasörlere asla dokunmamalı ve içindeki hiçbir şeyi değiştirmemelisin. Kodunu her çalıştırdığında sistem bu klasörleri siler ve baştan yaratır.

---

### 💡 Özetle Senin Odaklanman Gereken 3 Yer:
Backend'de bir şey değiştirmek veya eklemek istediğinde sıklıkla izleyeceğin yol şudur:
1. **`Models/`**: Yeni kavramı veya özelliği buraya eklersin.
2. **`Controllers/`**: Eklediğin bu özelliği Frontend'e (React'e) açacak kapıyı (endpoint) buraya yazarsın.
3. **`appsettings.json`**: Veritabanı şifresi gibi ayarları değiştirmen gerekirse buraya bakarsın.
