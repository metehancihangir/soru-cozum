# Arapça Soru Çözüm Platformu

Modern ve kullanıcı dostu bir web uygulaması ile geçmiş sınavlarda çıkmış Arapça sorularını çözün, anlık geri bildirim alın.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [API Endpointleri](#api-endpointleri)
- [Geliştirme](#geliştirme)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## Genel Bakış

**ArapçaSoru**, üniversite sınavları, YÖK sınavları ve diğer Arapça dil sınavlarına hazırlanan öğrenciler için geliştirilmiş bir dijital soru çözüm platformudur. Uygulama, geçmiş yıllarda çıkmış gerçek sınav sorularını interaktif bir şekilde sunar ve yanlış cevap verildiğinde anında açıklama göstererek öğrenmeyi destekler.

### Hedef Kitle

- Üniversite ve YÖK sınav adayları (AUZEF, DGS, YDS vb.)
- İlahiyat fakültesi ve Arapça bölümü öğrencileri
- Dil kursu katılımcıları
- Arapça öğrenmek isteyen bireyler

## Özellikler

✨ **Temel Özellikler**

- 📚 **Geniş Soru Havuzu:** Geçmiş yıllarda çıkmış gerçek sınav soruları
- ⚡ **Anlık Geri Bildirim:** Cevapladığınız anda doğru/yanlış kontrolü
- 🎯 **Detaylı Çözümler:** Yanlış cevaplarda açıklayıcı çözüm metinleri
- 🌐 **RTL Desteği:** Arapça metinler için tam sağdan-sola yazım desteği
- 🔍 **Filtreleme:** Ders, sınav türü ve yıla göre soruları filtreleme
- 📱 **Responsive Tasarım:** Mobil ve masaüstü uyumlu arayüz

🚀 **Planlanan Özellikler**

- Kullanıcı hesabı ve ilerleme takibi
- Skor tablosu ve istatistikler
- Konu bazlı soru kategorileri
- Quiz modu (belirli sayıda soruluk oturumlar)
- Soru içe aktarma (Excel/JSON)
- Dark mode desteği

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| **Backend** | .NET Core Web API | 8.0 / 9.0 |
| **Frontend** | React.js | 18+ |
| **Veritabanı** | MySQL | 8.0+ |
| **ORM** | Entity Framework Core | 8.0 |
| **Dil** | C#, JavaScript | - |
| **Encoding** | utf8mb4 | Arapça karakter desteği |

## Kurulum

### Gereksinimler

- .NET SDK 8.0 veya üzeri
- Node.js 18+ ve npm
- MySQL 8.0 veya üzeri

### Backend Kurulumu

```bash
# Backend klasörüne git
cd Backend/ArapcaSoruApi/ArapcaSoruApi

# Bağımlılıkları yükle
dotnet restore

# appsettings.json dosyasını düzenle (MySQL bağlantı bilgileri)

# Veritabanı migration'larını uygula
dotnet ef database update

# API'yi çalıştır
dotnet run
```

API varsayılan olarak `https://localhost:5001` adresinde çalışacaktır.

### Frontend Kurulumu

```bash
# Frontend klasörüne git
cd Frontend

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur ve API URL'sini ayarla
echo "VITE_API_URL=https://localhost:5001" > .env

# Geliştirme sunucusunu başlat
npm run dev
```

Frontend uygulama `http://localhost:5173` adresinde erişilebilir olacaktır.

### Veritabanı Ayarları

MySQL veritabanınızda aşağıdaki ayarları yapın:

```sql
CREATE DATABASE ArabicQuiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> **Önemli:** Arapça karakterlerin doğru saklanması için `utf8mb4` encoding kullanılmalıdır.

## Kullanım

1. Uygulamayı tarayıcınızda açın (`http://localhost:5173`)
2. Ana sayfadan ders seçin (Arapça-2 veya Arapça-4)
3. Sınav türünü seçin (Vize, Final, Yaz Okulu vb.)
4. Yıl seçin
5. Soruları çözmeye başlayın
6. Bir şıkka tıkladığınızda:
   - ✅ **Doğru cevap:** Yeşil renkle vurgulanır
   - ❌ **Yanlış cevap:** Kırmızı renkle vurgulanır ve doğru cevap gösterilir
   - 💡 **Çözüm:** Açıklama metni otomatik olarak görüntülenir

## Proje Yapısı

```
soru-cozum/
├── Backend/
│   └── ArapcaSoruApi/
│       └── ArapcaSoruApi/
│           ├── Controllers/      # API endpointleri
│           │   └── QuestionsController.cs
│           ├── Models/           # Veri modelleri
│           │   └── Question.cs
│           ├── Data/             # Veritabanı context
│           │   └── AppDbContext.cs
│           └── Program.cs        # Uygulama giriş noktası
├── Frontend/
│   └── src/
│       ├── components/           # React bileşenleri
│       │   ├── HomeScreen.jsx
│       │   ├── QuestionCard.jsx
│       │   └── ...
│       ├── services/             # API servisleri
│       │   └── questionService.js
│       ├── App.jsx               # Ana uygulama
│       └── main.jsx              # Giriş noktası
├── docs/                         # Dokümantasyon
└── README.md                     # Bu dosya
```

## API Endpointleri

### Sorular

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/questions` | Tüm soruları getirir |
| GET | `/api/questions?course=Arapca-2&examType=Final&year=2021` | Filtrelenmiş soruları getirir |
| GET | `/api/questions/{id}` | Belirli bir soruyu getirir |
| POST | `/api/questions` | Yeni soru ekler (Admin) |
| PUT | `/api/questions/{id}` | Soruyu günceller (Admin) |
| DELETE | `/api/questions/{id}` | Soruyu siler (Admin) |

### Örnek İstek

```bash
curl -X GET "https://localhost:5001/api/questions?course=Arapca-2&examType=Final&year=2021"
```

### Örnek Yanıt

```json
{
  "id": 1,
  "courseName": "Arapca-2",
  "examType": "Final",
  "year": 2021,
  "imagePath": "/images/soru1.png",
  "correctOption": "C",
  "explanation": "Bu soruda geçen kelime..."
}
```

## Geliştirme

### Kod Kalitesi

- Backend: ESLint + Prettier
- Frontend: ESLint + Prettier

### Test

```bash
# Backend testleri
cd Backend/ArapcaSoruApi/ArapcaSoruApi
dotnet test

# Frontend testleri
cd Frontend
npm test
```

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Projeyi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**İletişim:** Proje hakkında sorularınız için issue açabilirsiniz.

**Keyifli öğrenmeler! 🎓**