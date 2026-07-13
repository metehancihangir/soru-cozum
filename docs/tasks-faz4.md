# ✅ FAZ 4 — Görev Listesi: Soru Bileşenleri ve Anlık Cevap Geri Bildirimi

> **Kaynak:** [roadmap-arabic-quiz.md — FAZ 4](../roadmap-arabic-quiz.md#-faz-4--soru-bileşenleri-ve-anlık-cevap-geri-bildirimi)
> **Hedef:** `QuestionCard` ve `OptionButton` bileşenlerini yaz; useState state makinesiyle anlık kırmızı/yeşil geri bildirimi çalıştır.
> **Tahmini süre:** 2–3 saat
> **Ön koşul:** FAZ 3 tamamlanmış olmalı — API'den veri geliyor, `questions` state'i dolu.
> **Durum:** ✅ TAMAMLANDI

---

## 🏗️ Bileşen Mimarisi Kararı
> *Roadmap Ref → §4.1 · Component Decomposition Stratejisi*

- [x] **G-1** Bileşen hiyerarşisi onaylandı:
  ```
  App.jsx
    └── QuestionCard.jsx   ← soru + state
          └── OptionButton.jsx  ← her şık (x4 veya x5)
  ```
- [x] **G-2** `src/components/OptionButton.jsx` oluşturuldu
- [x] **G-3** `src/components/QuestionCard.jsx` oluşturuldu

---

## ⚙️ App.jsx — State Makinesi Kurulumu
> *Roadmap Ref → §4.2 · State Makinesi Tasarımı*

- [x] **G-4** Dört state tanımlandı: `currentIndex=0`, `selectedOption=null`, `isAnswered=false`, `isCorrect=false`
- [x] **G-5** `currentQuestion = questions[currentIndex]` türetilmiş değişkeni tanımlandı
- [x] **G-6** `handleOptionClick(option)` fonksiyonu yazıldı: `setSelectedOption`, `setIsAnswered(true)`, `setIsCorrect(option === correctOption)`
- [x] **G-7** `handleNextQuestion()` fonksiyonu yazıldı: index artırma + tüm state'lerin sıfırlanması
- [x] **G-8** Guard clause eklendi: `!currentQuestion` durumunda "Tüm sorular tamamlandı!" mesajı
- [x] **G-9** `QuestionCard` import edildi ve tüm gerekli prop'larla render edildi

---

## 🃏 QuestionCard Bileşeni
> *Roadmap Ref → §4.4 · QuestionCard Bileşeni Anatomisi*

- [x] **G-10** Prop'lar tanımlandı: `{ question, currentIndex, questionsTotal, selectedOption, isAnswered, isCorrect, onOptionClick, onNext }`
- [x] **G-11** RTL soru metni render edildi: `<div className="question-text rtl">`
- [x] **G-12** `["A","B","C","D","E"]` dizisi üzerinde `.map()` ile şıklar render edildi
- [x] **G-13** `question[`option${letter}`]` boş/null kontrolü — boş şıklar atlandı (E opsiyonel)
- [x] **G-14** Her şık için `OptionButton` kullanıldı; `key={letter}` verildi
- [x] **G-15** Açıklama bloğu yazıldı: `isAnswered && !isCorrect` koşulunda görünür
- [x] **G-16** "Sonraki Soru →" / "Testi Bitir 🎉" butonu yazıldı: `isAnswered` true iken görünür
- [x] **G-17** Soru sayacı eklendi: "Soru 1 / 5" formatında

---

## 🔘 OptionButton Bileşeni
> *Roadmap Ref → §4.3 · OptionButton Renk Mantığı*

- [x] **G-18** Prop'lar tanımlandı: `{ option, text, isAnswered, selectedOption, correctOption, onClick }`
- [x] **G-19** `getButtonClass()` fonksiyonu yazıldı: default → correct (yeşil) → wrong (kırmızı) mantığı
- [x] **G-20** `<button>` elemanına `className={getButtonClass()}` uygulandı
- [x] **G-21** `disabled={isAnswered}` — cevap sonrası tüm butonlar pasif
- [x] **G-22** `onClick={onClick}` prop'u eklendi
- [x] **G-23** Şık harfi ve metin ayrı `<span>` elemanlarında render edildi

---

## 🧪 Doğrulama Testleri
> *Roadmap Ref → §4 · Faz 4 Doğrulama Kontrol Listesi*

- [x] **T-1** Sayfa açıldığında ilk soru ve şıkları görünüyor — DB'de A ve B şıkkı mevcut, C/D/E null olduğu için 2 şık gösteriliyor *(doğrulandı)*
- [x] **T-2** Doğru şıka (B) tıklandığında: şık yeşil, açıklama görünmüyor *(doğrulandı)*
- [x] **T-3** Yanlış şıka tıklandığında: seçilen kırmızı, doğru şık yeşil, "Doğru Cevap: B" açıklaması görünüyor — explanation metni DB'de null, kod doğru davranıyor *(doğrulandı)*
- [x] **T-4** Şık seçildikten sonra diğer butonlar `disabled` *(doğrulandı)*
- [ ] **T-5** "Sonraki Soru" state sıfırlaması — DB'de tek soru olduğu için doğrulanamadı; **daha fazla soru eklendikten sonra test edilecek**
- [ ] **T-6** `currentIndex` artışı — DB'de tek soru olduğu için doğrulanamadı; **daha fazla soru eklendikten sonra test edilecek**
- [x] **T-7** Son (ve tek) soruda "Testi Bitir 🎉" yazıyor *(doğrulandı)*
- [x] **T-8** C/D/E null olan soruda sadece A ve B şıkkı görünüyor — bileşen boş şıkları doğru atlıyor *(doğrulandı)*
- [x] **T-9** `vite build` — 0 hata, 0 uyarı, 20 modül derlendi *(doğrulandı)*

---

## ✅ Faz 4 Doğrulama
> *Roadmap Ref → §4 · Faz 4 Doğrulama Kontrol Listesi*

- [x] **D-1** Şık tıklandığında renk değişimi anlık çalışıyor *(doğrulandı)*
- [x] **D-2** Yanlış şık: kırmızı + doğru şık yeşil + açıklama bloğu görünüyor — explanation metni DB'de girilince tam çalışacak *(doğrulandı)*
- [x] **D-3** Doğru şık: sadece yeşil, açıklama görünmüyor *(doğrulandı)*
- [x] **D-4** Bir şık seçildikten sonra diğerleri `disabled` *(doğrulandı)*
- [ ] **D-5** State sıfırlama — tek soru nedeniyle doğrulanamadı; **daha fazla soru eklendikten sonra test edilecek**
- [x] **D-6** Son soruda "Testi Bitir 🎉" görünüyor *(doğrulandı)*
- [x] **D-7** Null olan C/D/E şıkları gösterilmiyor — sadece 2 şık görünüyor *(doğrulandı)*
- [ ] **D-8** `QuestionCard.jsx`, `OptionButton.jsx`, `App.jsx`, `App.css` git'e commit edildi

---

> ⏭️ **Bir sonraki faz:** [tasks-faz5.md](./tasks-faz5.md) — RTL Entegrasyonu ve UI/UX Tasarımı
