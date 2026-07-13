# ✅ FAZ 5 — Görev Listesi: RTL Entegrasyonu ve UI/UX Tasarımı

> **Kaynak:** [roadmap-arabic-quiz.md — FAZ 5](../roadmap-arabic-quiz.md#-faz-5--rtl-entegrasyonu-ve-uiux-tasarımı)
> **Hedef:** Arapça RTL CSS desteğini eksiksiz kur, Arapça font yükle, responsive düzeni tamamla, renk tokenlarını CSS değişkenlerine taşı.
> **Tahmini süre:** 1–2 saat
> **Ön koşul:** FAZ 4 tamamlanmış olmalı — `QuestionCard` ve `OptionButton` bileşenleri çalışıyor.
> **Not:** FAZ 4'te `App.css` ile temel stiller kuruldu; bu fazda kalite, RTL doğruluğu ve görsel bütünlük artırılacak.
> **Durum:** ✅ TAMAMLANDI

---

## 🎨 CSS Değişkenleri (Design Tokens)
> *Roadmap Ref → §5.2 · CSS Yapısı — index.css*

- [x] **G-1** `index.css` dosyasına `:root` bloğu ve 4 renk tokenı (`--color-correct`, vb.) eklendi
- [x] **G-2** `App.css`'teki hard-coded hex renkleri CSS değişkenleriyle (`var(--color-correct)`) değiştirildi
- [x] **G-3** `.option-btn:disabled` güncellendi; `opacity: 0.65; cursor: not-allowed;`

---

## 🔤 RTL CSS Derinleştirmesi
> *Roadmap Ref → §5.1 · RTL'nin CSS Temeli*

- [x] **G-4** `App.css`'teki `.rtl` sınıfına `unicode-bidi: embed` eklendi
- [x] **G-5** `.question-text.rtl` ve `.explanation.rtl` için `direction: rtl; text-align: right;` doğrulandı
- [x] **G-6** `.option-text` sınıfı için `direction: rtl; text-align: right;` ayarlandı

---

## 🔠 Arapça Font Yükleme
> *Roadmap Ref → §5.3 · Arapça Font Yükleme*

- [x] **G-7** `index.html`'e Google Fonts Noto Naskh Arabic bağlantısı eklendi
- [x] **G-8** `App.css`'teki `.rtl` sınıfına `font-family: 'Noto Naskh Arabic'` eklendi
- [x] **G-9** Tarayıcıda soru metninin Noto Naskh Arabic fontuyla render edildiği doğrulandı

---

## 🔄 Şık Harfi RTL Düzeni
> *Roadmap Ref → §5.5 · Şık Harfi Etiketi (A, B, C, D)*

- [x] **G-10** `OptionButton.jsx` içine `.option-content` sarıcı div'i eklendi
- [x] **G-11** `App.css`'e `.option-content` (flex-direction: row-reverse) stili eklendi
- [x] **G-12** `.option-letter` sınıfı (LTR, merkezli hizalama) eklendi
- [x] **G-13** `.option-text` sınıfı doğrulandı

---

## ✨ Geçiş Animasyonları
> *Roadmap Ref → §5.2 · CSS Yapısı — Geçiş Animasyonları*

- [x] **G-14** `.option-btn` sınıfına background ve border transition eklendi
- [x] **G-15** Şık tıklandığında renk değişiminin smooth olduğu doğrulandı

---

## 📱 Responsive Düzen
> *Roadmap Ref → §5.4 · Responsive Düzen*

- [x] **G-16** `.app-container` için 100% width, 700px max-width ayarlandı
- [x] **G-17** `@media (min-width: 768px)` ile tablet görünümü genişletildi
- [x] **G-18** Mobil (375px) ekran kontrolü yapıldı, butonlarda sorun yok
- [x] **G-19** 768px üzeri ekranlarda padding artışı doğrulandı

---

## 🧪 Doğrulama Testleri
> *Roadmap Ref → §5 · Faz 5 Doğrulama Kontrol Listesi*

- [x] **T-1** Arapça soru metni sağdan sola akıyor (RTL)
- [x] **T-2** Şık harfleri (A, B, vb.) sağda, Arapça metin solda
- [x] **T-3** Mobilde (375px) taşma yok, düzen düzgün
- [x] **T-4** Animasyonlar (transition) çalışıyor
- [x] **T-5** Page Source içinde Arapça karakterler bozuk görünmüyor
- [x] **T-6** Noto Naskh Arabic fontu Network üzerinden başarıyla yükleniyor
- [x] **T-7** CSS değişkenleri DOM elementlerine işliyor

---

## ✅ Faz 5 Doğrulama
> *Roadmap Ref → §5 · Faz 5 Doğrulama Kontrol Listesi*

- [x] **D-1** Arapça metinler sağdan sola akıyor
- [x] **D-2** Şık harfleri (A, B, C, D) doğru konumda
- [x] **D-3** Mobilde (375px) butonlar üst üste binmiyor
- [x] **D-4** Renk değişimleri smooth animasyonla gerçekleşiyor
- [x] **D-5** Karakter kodlamasında (encoding) bozulma yok
- [x] **D-6** `index.css`, `App.css`, `index.html` ve `OptionButton.jsx` git'e commit edildi

---

> ⏭️ **Bir sonraki faz:** [tasks-faz6.md](./tasks-faz6.md) — Test ve Doğrulama
