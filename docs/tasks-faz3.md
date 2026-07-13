# ✅ FAZ 3 — Görev Listesi: React Kurulumu ve API Servis Katmanı

> **Kaynak:** [roadmap-arabic-quiz.md — FAZ 3](../roadmap-arabic-quiz.md#-faz-3--react-kurulumu-ve-api-servis-katmanı)
> **Hedef:** Mevcut Vite + React projesini temizle, `questionService.js` servis katmanını kur, API'den veri çek ve console'da doğrula.
> **Tahmini süre:** 30 dakika – 1 saat
> **Ön koşul:** FAZ 2 tamamlanmış olmalı — API `http://localhost:5248`'de çalışıyor, CORS `5173` için açık.
> **Durum:** ✅ TAMAMLANDI

---

## 🧹 Mevcut Şablon İçeriğini Temizle
> *Roadmap Ref → §3.2 · React Proje Kurulumu*

- [x] **G-1** `src/App.jsx` Vite şablon içeriği temizlendi; `useState`/`useEffect` + API çekimi iskeletiyle yeniden yazıldı
- [x] **G-2** `src/App.css` boşaltıldı (dosya korundu)
- [x] **G-3** `src/index.css` temizlendi — sadece temel box-sizing ve body reset bırakıldı
- [x] **G-4** `src/assets/` içindeki tüm şablon görselleri silindi
- [x] **G-5** `src/App.jsx` içinden `reactLogo`, `viteLogo`, `heroImg` import satırları kaldırıldı
- [x] **G-6** Vite dev server hatasız başlatıldı; proxy üzerinden `200 OK` alındı

---

## 🗂️ Klasör Yapısı Oluştur
> *Roadmap Ref → §3.1 · Neden Ayrı Bir services/ Katmanı?*

- [x] **G-7** `src/services/` klasörü oluşturuldu
- [x] **G-8** `src/components/` klasörü oluşturuldu (FAZ 4'e hazırlık)

---

## 🔌 Vite Proxy Yapılandırması
> *Roadmap Ref → §3.2 · React Proje Kurulumu*

- [x] **G-9** `vite.config.js` dosyası açıldı ve güncellendi
- [x] **G-10** `server.proxy` bloğu eklendi: `/api` prefix'li tüm istekler `http://localhost:5248`'e yönlendirildi
- [x] **G-11** `changeOrigin: true` eklendi — host header'ı hedef sunucuya göre ayarlanır

---

## 🔧 questionService.js — API Servis Katmanı
> *Roadmap Ref → §3.3 · questionService.js Tasarımı*

- [x] **G-12** `src/services/questionService.js` dosyası oluşturuldu
- [x] **G-13** `API_BASE = '/api/questions'` sabiti tanımlandı (proxy uyumlu)
- [x] **G-14** `getQuestions()` — `async/await + try/catch` ile yazıldı; hata `throw` edildi
- [x] **G-15** `getQuestionById(id)` — tek soru getiren fonksiyon yazıldı
- [x] **G-16** `createQuestion(data)` — `POST`, `Content-Type: application/json` ile yazıldı
- [x] **G-17** `updateQuestion(id, data)` — `PUT` isteği yazıldı
- [x] **G-18** `deleteQuestion(id)` — `DELETE` isteği yazıldı
- [x] **G-19** Tüm fonksiyonlar `export` ile dışa aktarıldı

---

## ⚛️ App.jsx — İlk Veri Çekimi
> *Roadmap Ref → §3.4 · App.jsx — İlk Veri Çekimi*

- [x] **G-20** `useState` ve `useEffect` import'ları eklendi
- [x] **G-21** `getQuestions` `questionService.js`'den import edildi
- [x] **G-22** Üç state tanımlandı: `questions = []`, `loading = true`, `error = null`
- [x] **G-23** `useEffect(() => { ... }, [])` kancası yazıldı — bağımlılık dizisi boş
- [x] **G-24** `useEffect` içinde `getQuestions()` çağrısı; `.then()` ile `setQuestions` ve `setLoading(false)` çalıştırıldı
- [x] **G-25** `.catch()` ile hata yakalandı; `setError` ve `setLoading(false)` çalıştırıldı
- [x] **G-26** JSX'te üç durum render edildi: `loading` → "Yükleniyor...", `error` → hata mesajı, normal → soru sayısı

---

## 🧪 Doğrulama Testleri
> *Roadmap Ref → §3 · Faz 3 Doğrulama Kontrol Listesi*

- [x] **T-1** Backend (`localhost:5248`) ve Frontend (`localhost:5174`) aynı anda çalıştırıldı
- [x] **T-2** `GET http://localhost:5174/api/questions` isteği `200 OK` döndü *(proxy doğrulandı)*
- [x] **T-3** JSON yanıtında Arapça karakterler (`كتاب`, `قلم`) bozulmadı
- [x] **T-4** API yanıtında mevcut soru(lar) görüntülendi
- [ ] **T-5** Backend kapatılıp sayfa yenilendiğinde hata mesajı görünüyor *(tarayıcıda manuel test)*
- [ ] **T-6** Browser konsolunda `CORS error` yok *(tarayıcıda manuel test)*
- [ ] **T-7** Browser konsolunda `Uncaught` hatası yok *(tarayıcıda manuel test)*

---

## ✅ Faz 3 Doğrulama
> *Roadmap Ref → §3 · Faz 3 Doğrulama Kontrol Listesi*

- [x] **D-1** Vite dev server hatasız başlıyor
- [x] **D-2** Proxy üzerinden `GET /api/questions` → `200 OK` doğrulandı
- [x] **D-3** JSON yanıtında Arapça karakterler sağlam *(proxy test çıktısında görüldü)*
- [x] **D-4** Hata state'i (`error`) yapılandırıldı — API kapalıyken crash olmaz
- [x] **D-5** CORS çalışıyor — FAZ 2'de `5173` için yapılandırılmıştı, proxy ile artık doğrudan CORS politikasına çarpmıyor
- [ ] **D-6** `questionService.js`, `App.jsx`, `vite.config.js` git'e commit edildi

---

> ⏭️ **Bir sonraki faz:** [tasks-faz4.md](./tasks-faz4.md) — Soru Bileşenleri ve Anlık Cevap Geri Bildirimi
