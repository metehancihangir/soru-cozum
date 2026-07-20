# Arapça Soru Çözüm Uygulaması - Proje Rehberi

Hoş geldin! Bu rehber, projenin ezberlenerek değil, **mantığı kavranarak** öğrenilmesi için hazırlandı. Hiçbir kod bloğuna boğulmadan, projenin kalbinden başlayıp yüzeyine kadar nasıl çalıştığını adım adım hikayeleştirerek inceleyeceğiz.

Projemiz temel olarak üç parçadan oluşuyor:
1. **Backend (.NET API):** Verileri yöneten, güvenliği ve iş kurallarını sağlayan "garson".
2. **Frontend (React):** Kullanıcının gördüğü, etkileşime girdiği "vitrin".
3. **Database (MySQL):** Tüm soruların kalıcı olarak saklandığı "depo".

Haydi, projenin merkezinden başlayalım!

---

## 1. Arka Uç (Backend - .NET API) Katmanı

Backend katmanı, veritabanı ile ön yüz arasında bir köprü görevi görür. Ön yüzün doğrudan veritabanına erişmesi güvenli değildir; bu yüzden arada kuralları koyan API (*Application Programming Interface - Uygulama Programlama Arayüzü*) bulunur.

### `Backend/ArapcaSoruApi/ArapcaSoruApi/Models/Question.cs`
- **Konumu ve Görevi:** Projenin temel yapıtaşıdır. Veritabanında saklayacağımız bir "Sorunun" şablonunu belirler.
- **Teknik Terim - Entity (Varlık):** Yazılımda veritabanındaki bir tabloya karşılık gelen, verinin şeklini tanımlayan sınıflara Entity denir.
- **Mantığı:** Bu dosyada bir sorunun hangi özellikleri olacağı tanımlanır (Örn: Dersin adı, sınav türü, hangi yıla ait olduğu, sorunun resim yolu, doğru şıkkı ve açıklama metni). Veritabanına "Bana şu şekilde bir tablo hazırla" demenin kod halidir.

### `Backend/ArapcaSoruApi/ArapcaSoruApi/Data/AppDbContext.cs`
- **Konumu ve Görevi:** C# kodlarımız ile MySQL veritabanı arasındaki iletişim kanalıdır.
- **Mantığı:** Bu dosya, `Question.cs` modelini alır ve "Bunu veritabanında 'Questions' adında bir tabloya dönüştür" emrini verir. Ayrıca veritabanına girip çıkan verilerin Arapça karakterleri düzgün tanıması için gerekli özel ayarları (*utf8mb4*) ve verilerin hızlı aranması için "İndeksleme" (fihrist) mantığını burada kurar.

### `Backend/ArapcaSoruApi/ArapcaSoruApi/Controllers/QuestionsController.cs`
- **Konumu ve Görevi:** Dışarıdan gelen istekleri (siparişleri) karşılayan ana merkezdir. 
- **Teknik Terim - Endpoint (Uç Nokta):** İnternet üzerinden API'mize ulaşmak için kullanılan belirli web adresleridir (Örn: `/api/questions`).
- **Mantığı:** Frontend buraya bir istek atar. Örneğin, "Bana 2021 yılı Yaz Okulu Arapça-2 sorularını getir" der. Bu dosyadaki `GetQuestions` isimli metot (fonksiyon) çalışır; `AppDbContext` üzerinden veritabanına gidip istenen soruları bulur ve Frontend'e teslim eder. 
- **Veri Akışı:** Veri, veritabanından `AppDbContext` aracılığıyla alınır, `Question` modeli formatına sokulur ve `QuestionsController` üzerinden Frontend'e paketlenip (*JSON formatında*) gönderilir.

---

## 2. Ön Yüz (Frontend - React) Katmanı

Kullanıcının gördüğü, butonlara tıkladığı ve sınavı çözdüğü yer burasıdır. React, arayüzü küçük parçalara (*Component*) bölerek inşa etmemizi sağlar.

### `Frontend/src/services/questionService.js`
- **Konumu ve Görevi:** Frontend'in Backend'e açılan kapısıdır. Telefon hattı gibi düşünebilirsin.
- **Mantığı:** React bileşenleri veriye ihtiyaç duyduğunda direkt API adreslerini yazmak yerine bu dosyadaki fonksiyonları kullanırlar. `getQuestions` isimli fonksiyon, Backend'deki `QuestionsController`'a istek atıp soruları alıp React uygulamasına getirir.

### `Frontend/src/App.jsx`
- **Konumu ve Görevi:** Uygulamanın beyni ve ana iskeletidir. Tüm sayfalar arası geçişler ve verinin hafızada tutulması burada gerçekleşir.
- **Teknik Terim - Routing (Yönlendirme):** Kullanıcıyı "Ana Sayfa"dan "Soru Ekranı"na geçiren sayfa değiştirme mekanizmasıdır.
- **Teknik Terim - State (Durum):** Uygulamanın o anki hafızasıdır. (Örn: "Kullanıcı şu an 3. soruda", "Skoru 15", "Seçtiği ders Arapça-2" gibi anlık bilgilerin tutulduğu yer).
- **Mantığı:** `App.jsx`, kullanıcının hangi ekranda olduğunu takip eder (Ana menü, Sınav Türü, Yıl, Soru Çözümü veya Bitiş). Bir ders seçildiğinde State güncellenir ve kullanıcı bir sonraki adıma yönlendirilir.

### `Frontend/src/components/HomeScreen.jsx`
- **Konumu ve Görevi:** Kullanıcının siteye girdiğinde gördüğü ilk karşılama ekranıdır.
- **Teknik Terim - Component (Bileşen):** Kendi başına çalışabilen, tekrar kullanılabilir arayüz parçacıklarıdır. (Tıpkı legolar gibi).
- **Mantığı:** Ekranda "Arapça-2" veya "Arapça-4" gibi ders kartlarını gösterir. Kullanıcı bir karta tıkladığında, tıkladığı bilgisini üst mercie (yani `App.jsx`'e) iletir.

### `Frontend/src/components/QuestionCard.jsx`
- **Konumu ve Görevi:** Sorunun, şıkların ve "Neden Yanlış?" panellerinin gösterildiği ekrandır.
- **Mantığı:** `App.jsx` Backend'den indirdiği soruları bu bileşene tek tek gönderir. `QuestionCard`, sorunun resmini ekrana basar, A'dan E'ye kadar şıkları çizer. Kullanıcı bir şıkka tıkladığında, şıkkın doğru olup olmadığını kontrol eder. Eğer yanlışsa sorunun çözüm/açıklama bilgisini ekranda gösterir.
- **Veri Akışı:** Veri `questionService.js` ile Frontend'e girer, `App.jsx`'in State'inde (hafızasında) saklanır, oradan da ekranda gösterilmek üzere `QuestionCard.jsx`'e paslanır.

---

## 3. Veritabanı (MySQL) Yapısı ve Bağlantı Ayarları

Verilerimizin kaybolmadan sonsuza kadar yaşamasını sağlayan en alt katmanımız.

- **Tablo Yapısı:** Backend'deki `Question.cs` dosyasının yansıması olarak, veritabanımızda **Questions** adında bir tablo bulunur. Bu tabloda sütunlar şunlardır:
  - `Id`: Her sorunun benzersiz TC Kimlik Numarası.
  - `CourseName`: Dersin adı.
  - `ExamType`: Sınav türü.
  - `Year`: Yıl.
  - `ImagePath`: Sorunun resminin nerede kayıtlı olduğu.
  - `CorrectOption`: Sorunun doğru cevabı.
  - `Explanation`: Hata yapıldığında gösterilecek çözüm açıklaması.
  
- **Bağlantı Ayarları & Arapça Desteği:** `AppDbContext.cs` içerisinde özel olarak belirtilen "utf8mb4" karakter seti, Arapça harflerin veritabanına sorunsuz (bozuk karakter olmadan) kaydedilmesini sağlar. Ayrıca uygulamamız filtreleme yaparken (Örn: "Bana sadece 2021 yılı Arapça-2 sorularını getir") veritabanında çok hızlı arama yapabilmesi için Ders Adı, Sınav Türü ve Yıl kolonları birbirine bağlanarak "İndekslenmiştir" (Hızlı arama fihristi oluşturulmuştur).

---

### Uçtan Uca Hikaye (Özet)
1. Öğrenci siteye girer, karşısına **`HomeScreen.jsx`** çıkar.
2. Öğrenci "Arapça-2", "Yaz Okulu", "2021" seçeneğine tıklar.
3. **`App.jsx`**, bu seçimleri hafızaya alır (State) ve **`questionService.js`** üzerinden Backend'e sipariş verir.
4. Sipariş, Backend'deki **`QuestionsController.cs`**'nin kapısını çalar.
5. Controller, **`AppDbContext.cs`**'ye gidip MySQL veritabanından o yıla ait soruları kutular (**`Question.cs`** modeli ile).
6. Sorular Frontend'e geri ulaştığında **`App.jsx`**, ilk soruyu alıp **`QuestionCard.jsx`** bileşenine teslim eder.
7. Öğrenci yanlış şıkkı işaretlerse, veritabanından gelen "Explanation" (Açıklama) metni ekranda belirir.

Bu rehberi proje klasörlerinde gezinirken bir harita gibi kullanabilirsin. İyi çalışmalar!
