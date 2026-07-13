# Product Vision — ArapçaSoru (Arabic Quiz App)

## Proje Özeti

**ArapçaSoru**, .NET Core Web API + MySQL + React.js teknoloji yığını üzerine inşa edilmiş bir **Çıkmış Arapça Soruları Çözme Platformu**'dur. Uygulama; geçmiş sınavlarda çıkmış Arapça sorularını soru-şık-çözüm formatında sunar ve kullanıcının cevapladığı anlık geri bildirim almasını sağlar. Yanlış şık seçildiğinde kırmızı/yeşil renk vurgusuyla doğru cevap ve açıklama metni ekrana gelir.

---

## Vizyon Beyanı

> Arapça öğrenen bireylerin geçmiş sınav sorularına erişimini kolaylaştıran, anlık geri bildirim ve çözüm açıklamalarıyla desteklenen; sağdan-sola (RTL) metin desteğini eksiksiz sunan modern ve genişletilebilir bir web tabanlı soru çözme platformu oluşturmak.

---

## Hedef Kullanıcılar

| Kullanıcı Profili | Açıklama |
|---|---|
| Üniversite / YÖK Sınav Adayları | AUZEF, DGS, YDS gibi sınavlara Arapça hazırlanan öğrenciler |
| İlahiyat / Arapça Öğrencileri | Dil derslerinde çıkmış sınav sorularıyla pratik yapmak isteyen öğrenciler |
| Dil Kursu Katılımcıları | Arapça özel kurs veya sertifika programlarına katılan bireyler |
| İçerik Yöneticileri / Editörler | Sisteme soru, şık ve çözüm metni ekleyen/düzenleyen yetkili kullanıcılar |
| Geliştiriciler (Öğrenim Amaçlı) | .NET Core Web API + React + MySQL mimarisini öğrenmek isteyen yazılımcılar |

---

## Çözdüğü Problem

Çıkmış Arapça sınav soruları; fiziksel kitaplar, dağınık PDF dosyaları veya statik web sayfalarında bulunmakta, anlık cevap kontrolü ve çözüm açıklaması sunamamaktadır. Kullanıcılar yanlış yaptıkları soruda neyi eksik bildiklerini anında öğrenememekte; sağdan sola (RTL) yazılan Arapça metinler pek çok platformda bozuk görüntülenmektedir. Bu uygulama:

- Tüm soruları merkezi bir veritabanında dijital olarak depolar.
- Kullanıcıya tıkladığı anda kırmızı/yeşil geri bildirim sunar.
- Yanlış cevapta doğru şıkkı ve açıklamayı anında gösterir.
- Arapça karakterleri `utf8mb4` encoding ile tam olarak saklar ve RTL CSS desteğiyle doğru görüntüler.

---

## Temel Değer Önerisi

- **Anlık Geri Bildirim**: Şıka tıklandığında renk vurgusu ve çözüm açıklaması hemen belirir; sayfa yenilemesi gerekmez.
- **RTL Desteği**: Arapça metinler `direction: rtl` CSS kuralı ile eksiksiz sağdan-sola hizalanır.
- **Temiz API Mimarisi**: RESTful endpoint'ler aracılığıyla frontend ve backend birbirinden bağımsız geliştirilir.
- **Genişletilebilirlik**: Yeni soru kategorileri, kullanıcı yönetimi, istatistik ve skor tablosu kolayca eklenebilir.
- **Modern Teknoloji**: .NET Core 8/9 + EF Core + MySQL + React ile güncel, sürdürülebilir bir yığın.

---

## Ürün Kapsamı (Mevcut Durum)

### Var Olan / Planlanmış Özellikler (MVP)

- Soru listesini API üzerinden çekme (`GET /api/questions`)
- Tek soru + şık (A, B, C, D, E) ekranı (React component)
- Şık seçimine göre anlık cevap kontrolü:
  - **Yanlış şık** → kırmızı vurgulu
  - **Doğru şık** → yeşil vurgulu
  - Hemen altında "Doğru Çözüm" açıklaması belirir
- Soru ekleme / düzenleme / silme (CRUD — Admin)
- MySQL `utf8mb4` encoding ile Arapça karakter desteği
- RTL CSS desteği ile doğru metin hizalaması
- CORS yapılandırması (React dev server ↔ .NET API)

### Mevcut Olmayan / Gelecekte Eklenebilecek Özellikler

- Kimlik doğrulama ve yetkilendirme (JWT Authentication)
- Soru kategorisi / konu filtresi (Gramer, Kelime Bilgisi, Okuma vb.)
- Kullanıcı skor takibi ve istatistik paneli
- Soru seti / quiz modu (N soruluk oturum)
- Sayfalama (Pagination) ve arama/filtreleme
- Mobil uygulama (React Native veya Flutter)
- Soru içe aktarma (Excel / JSON toplu import)
- Dark Mode desteği

---

## Teknoloji Yığını

| Katman | Teknoloji | Sürüm |
|---|---|---|
| **Backend** | .NET Core Web API (C#) | 8.0 / 9.0 |
| **ORM** | Entity Framework Core | 9.x |
| **Veritabanı** | MySQL | 8.x |
| **MySQL EF Provider** | Pomelo.EntityFrameworkCore.MySql | 9.x |
| **Frontend** | React.js | 18.x |
| **HTTP İstemcisi** | Fetch API / Axios | — |
| **Stil** | CSS (RTL destekli) | — |

---

## Veri Modeli (Entity Tasarımı)

### `Question` Tablosu

| Kolon | Tip | Kısıtlamalar | Açıklama |
|---|---|---|---|
| Id | int | PK, Identity | Birincil anahtar |
| QuestionText | longtext | Required, utf8mb4 | Arapça soru metni |
| OptionA | longtext | Required, utf8mb4 | A şıkkı |
| OptionB | longtext | Required, utf8mb4 | B şıkkı |
| OptionC | longtext | utf8mb4 | C şıkkı |
| OptionD | longtext | utf8mb4 | D şıkkı |
| OptionE | longtext | utf8mb4 | E şıkkı (opsiyonel) |
| CorrectOption | varchar(1) | Required | Doğru şık harfi (A/B/C/D/E) |
| Explanation | longtext | utf8mb4 | Yanlış yanıtta gösterilecek çözüm açıklaması |
| CreatedAt | datetime | — | Kayıt tarihi |

> **Not:** Şıkları ayrı bir tabloya (1:N ilişkili) taşımak yerine, başlangıç aşamasında tek tablo (flat) yapısı tercih edilmiştir. Bu yaklaşım geliştirme hızını artırır; ilerleyen aşamada normalize edilebilir.

---

## API Endpoint'leri (Planlanan)

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/questions` | Tüm soruları listele |
| GET | `/api/questions/{id}` | Tek soru getir |
| POST | `/api/questions` | Yeni soru ekle |
| PUT | `/api/questions/{id}` | Soru güncelle |
| DELETE | `/api/questions/{id}` | Soru sil |

---

## Frontend Durum Yönetimi (State)

React bileşeninde kullanılacak temel `useState` kancaları:

| State | Tip | Açıklama |
|---|---|---|
| `questions` | `Question[]` | API'den çekilen soru listesi |
| `currentIndex` | `number` | Ekrandaki aktif sorunun indeksi |
| `selectedOption` | `string \| null` | Kullanıcının tıkladığı şık harfi |
| `isAnswered` | `boolean` | Kullanıcı cevap verdi mi? |
| `isCorrect` | `boolean` | Seçilen cevap doğru mu? |

---

## Kritik Teknik Notlar

| Konu | Açıklama |
|---|---|
| **UTF-8 / Arapça Desteği** | MySQL bağlantı dizisine `charset=utf8mb4` eklenmeli; tablo ve kolon collation'ı `utf8mb4_unicode_ci` olmalı |
| **RTL Metin** | Soru ve şık metinleri içeren React elementlerine `direction: rtl; text-align: right;` CSS kuralı uygulanmalı |
| **CORS** | `Program.cs` içinde React dev server origins (`http://localhost:3000`) için CORS politikası tanımlanmalı |
| **EF Core Migration** | `dotnet ef migrations add InitialCreate` komutuyla veritabanı şeması kod üzerinden oluşturulacak |
| **Immutable Cevap** | Kullanıcı bir şık seçtikten sonra (`isAnswered = true`) diğer şıklar devre dışı bırakılmalı |

---

## Başarı Kriterleri

| Kriter | Ölçüt |
|---|---|
| **CRUD Fonksiyonelliği** | Soru ekleme, listeleme, düzenleme ve silme işlemleri sorunsuz çalışmalı |
| **Anlık Cevap Geri Bildirimi** | Şık seçimi anında kırmızı/yeşil renk değişimi ve açıklama görüntülenmeli |
| **Arapça Karakter Bütünlüğü** | Arapça metinler veritabanında bozulmadan saklanmalı ve ekranda doğru RTL hizalamasıyla gösterilmeli |
| **API Stabilitesi** | `GET /api/questions` endpoint'i 1 saniye altında yanıt vermeli |
| **Kod Kalitesi** | Controller, Service ve Entity katmanları birbirinden ayrı, okunabilir ve genişletilebilir yapıda olmalı |

---

## Proje Klasör Yapısı (Hedef)

```
ArabicQuizApp/
├── ArabicQuizAPI/                  ← .NET Core Web API
│   ├── Controllers/
│   │   └── QuestionsController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Models/
│   │   └── Question.cs
│   ├── Migrations/
│   ├── appsettings.json
│   └── Program.cs
│
└── arabic-quiz-client/             ← React Frontend
    ├── public/
    └── src/
        ├── components/
        │   ├── QuestionCard.jsx    ← Ana soru bileşeni
        │   └── OptionButton.jsx   ← Şık butonu (kırmızı/yeşil)
        ├── services/
        │   └── questionService.js  ← API fetch fonksiyonları
        ├── App.jsx
        └── index.css              ← RTL & genel stiller
```

---

## Geliştirme Aşamaları (Özet)

| Aşama | Kapsam | Tahmini Süre |
|---|---|---|
| **1 — Backend Temeli** | .NET Core projesi, EF Core, MySQL bağlantısı, `Question` entity, migration | 1-2 sa |
| **2 — API Katmanı** | `QuestionsController` CRUD endpoint'leri, CORS yapılandırması, Swagger | 1-2 sa |
| **3 — React Kurulumu** | `create-react-app`, API servis katmanı, soru fetch işlemi | 30 dk |
| **4 — Soru Bileşeni** | `QuestionCard`, `OptionButton`, state yönetimi, kırmızı/yeşil geri bildirim | 2-3 sa |
| **5 — RTL & Stil** | Arapça RTL CSS, responsive düzen, genel UI iyileştirmeleri | 1-2 sa |
| **6 — Test & Doğrulama** | API testleri (Postman/Swagger), UI testleri, Arapça karakter doğrulama | 1-2 sa |

**Toplam tahmini süre: 6.5-11.5 saat** (tam bir öğrenme hızıyla, acelesiz).
