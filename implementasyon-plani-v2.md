# Uygulama Geliştirme ve İyileştirme Planı (v2)

**Hazırlayan:** Teknik Ekip
**Tarih:** 24 Temmuz 2026
**Durum:** Taslak — Görev kartlarına dönüştürülmeye hazır
**Referans Görseller:** `chrome_pY1BupU0ii.png` (Soru ekranı), `chrome_tO5VlVrUVt.png` (Yapay Zeka Açıklaması paneli)

---

## 0. Özet ve Amaç

Bu belge, uygulamada tespit edilen kullanıcı deneyimi (UX), içerik/format ve altyapı eksikliklerini gidermek için hazırlanmış teknik yol haritasıdır. Öncelik sırası; kullanıcıyı doğrudan etkileyen mobil UX sorunlarına, ardından yapay zeka çıktı kalitesine, son olarak da altyapı/yönetim görevlerine verilmiştir.

**Genel Öncelik Sıralaması:**

| Öncelik | Görev | Etki |
|---|---|---|
| P0 (Kritik) | 3.2 – API Limit ve Kota Yönetimi | Uygulama tamamen kilitlenebiliyor |
| P0 (Kritik) | 1.2 – Şık Kayma Sorunu (tüm cihazlar) | Temel kullanılabilirlik |
| P1 (Yüksek) | 1.1 – AI Cevap Ekranına Zoom + Tam Ekran | Doğrudan Mete geri bildirimi |
| P1 (Yüksek) | 2.3 – AI Cevap Formatının Standardizasyonu | Ürün tutarlılığı |
| P2 (Orta) | 2.1 – PDF Görüntü Kalitesi | Kullanıcı memnuniyeti |
| P2 (Orta) | 2.2 – AI Cevabının Tek Ekrana Sığdırılması | 1.1 ile birlikte çözülecek |
| P3 (Düşük) | 3.1 – Admin Paneli | Operasyonel, kullanıcıyı doğrudan etkilemiyor |

---

## 1. UI / UX ve Mobil Uyumluluk Görevleri (Frontend)

### Görev 1.1: Yapay Zeka Açıklama Ekranına Zoom In/Out ve Tam Ekran Modu

**Öncelik:** P1
**İlgili ekran:** "Yapay Zeka Açıklaması" paneli (bkz. `chrome_tO5VlVrUVt.png`)

**Sorun:**
Şu anki açıklama paneli sabit/dar bir kart içinde gösteriliyor. Uzun açıklamalar (soru taktiği + adım adım çözüm) küçük punto ile uzun bir dikey kaydırma alanına sıkışıyor. Mete'nin talebi hem **yakınlaştırma/uzaklaştırma (pinch-to-zoom)** hem de **tam ekran görüntüleme** imkânı sağlanması.

**Kapsam (iki ayrı ama birbirini tamamlayan alt özellik):**

1. **Tam Ekran Modu**
   - Panelin sağ üst köşesine bir "tam ekran / genişlet" ikonu eklenecek.
   - Tıklandığında panel, modal/bottom-sheet olarak tüm ekranı kaplayacak şekilde açılacak.
   - Kapatmak için "X" butonu ve (Android'de) sistem geri tuşu desteklenecek.

2. **Pinch-to-Zoom (Yakınlaştırma)**
   - Tam ekran modunda içerik üzerinde iki parmakla yakınlaştırma/uzaklaştırma desteklenecek.
   - Öneri: `react-zoom-pan-pinch` kütüphanesi (metin + olası görsel/matematiksel ifadeler için uygun).
   - Metin bazlı içerikte alternatif olarak basit bir "font boyutu +/-" kontrolü de zoom'a tamamlayıcı olarak eklenebilir (erişilebilirlik için, pinch her cihazda hassas çalışmayabilir).
   - `touch-action: pinch-zoom` CSS özelliği ilgili container'da tanımlanacak; sayfanın geri kalanının yanlışlıkla zoom olmaması için `touch-action: manipulation` global ayarı korunacak.

**Teknik Notlar:**
- Zoom seviyesi component state'inde tutulacak, tam ekrandan çıkıldığında sıfırlanacak.
- Performans: uzun metinlerde zoom kütüphanesinin re-render maliyetini test et (özellikle düşük donanımlı Android cihazlarda).

**Kabul Kriterleri:**
- [ ] Kullanıcı açıklama panelini tam ekran açabiliyor.
- [ ] Tam ekranda iki parmakla yakınlaştırma/uzaklaştırma sorunsuz çalışıyor.
- [ ] iOS Safari, Android Chrome ve masaüstü tarayıcıda (mouse wheel + Ctrl ile veya buton ile) test edildi.
- [ ] Zoom sırasında metin bulanıklaşmıyor (SVG/vektör veya yeterli DPI'li render kullanılıyor).

---

### Görev 1.2: Şık Kayma Sorununun Çözülmesi (Tüm Cihazlar — Sadece iPhone Değil)

**Öncelik:** P0
**İlgili ekran:** Soru çözüm ekranı, A/B/C/D/E şıkları (bkz. `chrome_pY1BupU0ii.png`)

**Önemli Düzeltme:** Bu sorun yalnızca iPhone'a özgü değildir; farklı ekran genişliklerine sahip tüm cihazlarda (Android telefonlar, küçük ekranlı cihazlar, tablet vb.) şıklardan birinin (özellikle E şıkkı, ekran görüntüsünde olduğu gibi) alt satıra kayması gözlemlenmiştir. Kapsam tüm cihazları içerecek şekilde genişletilmiştir.

**Sorun Detayı:**
Ekran görüntüsünde A, B, C, D şıkları bir satırda, E şıkkı ise altta ayrı bir satırda görünüyor. Bu, dar viewport genişliğinde 5 dairesel butonun toplam genişliğinin container'ı aşmasından kaynaklanıyor.

**Aksiyon:**
- Şıkların bulunduğu container'da `flex-wrap: nowrap` yerine, gerçek ihtiyaç olan **tek satırda daraltılmış (responsive) 5 buton** düzeni kurulacak:
  - `display: flex; justify-content: space-between;` + genişliğe göre `flex: 1 1 0` ile eşit dağıtım.
  - Buton boyutu (`width`/`height`) ve font-size, `clamp()` CSS fonksiyonu ile ekran genişliğine göre dinamikleştirilecek (örn. `width: clamp(36px, 8vw, 56px)`).
  - Şık aralarındaki `gap` değeri de aynı şekilde responsive yapılacak.
- **Test matrisi genişletilecek:** Sadece iPhone değil, aşağıdaki cihaz/genişlik sınıfları test edilecek:
  - iPhone SE (en dar yaygın ekran, ~375px)
  - Standart iPhone (390–430px)
  - Küçük/orta Android cihazlar (360px, 412px)
  - Tablet (768px+) — burada şıkların gereksiz büyümediği de kontrol edilecek.
- Buton içindeki harf/etiketin (A, B, C...) taşmadığından emin olunacak (`overflow: hidden` + `text-overflow` gerekirse).

**Kabul Kriterleri:**
- [ ] 5 şık, test edilen tüm cihaz genişliklerinde (360px–430px) tek satırda kalıyor.
- [ ] Şıklar arası boşluk ve buton boyutu farklı ekranlarda orantılı ve dokunmatik kullanıma uygun (min. 40x40px dokunma alanı).
- [ ] Yatay taşma (horizontal scroll) oluşmuyor.

---

## 2. İçerik ve Format Düzenlemeleri (Yapay Zeka ve Çıktılar)

### Görev 2.1: PDF Görüntü Kalitesinin Artırılması

**Öncelik:** P2

**Detay:** Dışa aktarılan PDF'lerin (özet/çözüm çıktıları) çözünürlüğü düşük ve okunması zor.

**Aksiyon:**
- PDF oluşturma kütüphanesinin (frontend: örn. `jsPDF`/`html2canvas`, veya backend tarafı çözüm) render DPI değeri artırılacak (örn. `html2canvas` kullanılıyorsa `scale: 2` veya `scale: 3` parametresi).
- Görsellerin (varsa Arapça harf görselleri, diyagramlar) sıkıştırma oranı düşürülecek; mümkünse orijinal vektör (SVG) formatı korunacak, rasterize edilmeyecek.
- Metin içeriği PDF'e resim olarak değil, gerçek metin (selectable text) olarak gömülecek — bu hem netliği garantiler hem de dosya boyutunu küçültür.

**Kabul Kriterleri:**
- [ ] PDF çıktısında metin net ve büyütüldüğünde (zoom) pikselleşmiyor.
- [ ] Dosya boyutu makul sınırlarda (aşırı büyümüyor).
- [ ] Metin PDF içinde kopyalanabilir/aranabilir durumda.

---

### Görev 2.2: Yapay Zeka Cevabının (Açıklama Panelinin) Tek Ekrana Sığdırılması

**Öncelik:** P2
**Not — Terminoloji Netleştirmesi:** Buradaki "özet", ayrı bir PDF özet dosyası değil, **yapay zekanın soru çözümü için ürettiği "Yapay Zeka Açıklaması" panelinin kendisidir** (bkz. `chrome_tO5VlVrUVt.png`). Bu görev, Görev 1.1'deki tam ekran/zoom özelliği ile doğrudan ilişkilidir; ikisi birlikte tasarlanmalıdır.

**Detay:**
Mevcut açıklama paneli (Soru Taktiği + Adım Adım Çözüm) uzun metin nedeniyle küçük kartta aşırı kaydırma gerektiriyor. Abinin talebi, bu içeriğin daha derli toplu, gerektiğinde tam ekranda tek bakışta okunabilir hale gelmesi.

**Aksiyon:**
- **Kısa vadeli çözüm (mevcut kart görünümü için):** Satır aralığı (`line-height`), font boyutu ve iç boşluklar (`padding`/`margin`) mobil ekranlarda optimize edilerek panelin daha az yer kaplaması sağlanacak.
- **Asıl çözüm (Görev 1.1 ile entegre):** Kullanıcı tam ekran moduna geçtiğinde, içerik zaten büyük ekranda daha rahat okunabilecek; bu nedenle "tek sayfaya sığdırma" hedefinin öncelikli çözümü zoom + tam ekran özelliğidir. Buna ek olarak:
  - İçerik başlıkları (🎯 SORU TAKTİĞİ, 📝 ADIM ADIM ÇÖZÜM) görsel olarak daha net ayrılacak (örn. accordion/collapsible bölümler — kullanıcı istediği bölümü açıp kapatabilir).
  - Çok uzun adım adım çözümlerde, adımlar arasına görsel ayraç (divider) eklenerek okunabilirlik artırılacak.

**Kabul Kriterleri:**
- [ ] Normal kart görünümünde gereksiz boşluk yok, içerik derli toplu.
- [ ] Tam ekran + zoom özelliği ile kullanıcı uzun açıklamayı rahatça okuyabiliyor.
- [ ] (Opsiyonel/tartışılacak) Bölümler daraltılıp genişletilebiliyor.

---

### Görev 2.3: Yapay Zeka Cevap Formatının Standardize Edilmesi

**Öncelik:** P1
**Referans:** Kullanıcının belirttiği hedef format örneği

**Detay:** Yapay zekanın sunduğu soru çözümleri, aşağıdaki sabit yapıya birebir uymalı:

```
[Genel açıklama metni]
**Çeviri:** [Metin]
**Taktik:** [Metin]
**A)** [Açıklama]
**B)** [Açıklama]
**C)** [Açıklama]
**D)** [Açıklama]
**E)** [Açıklama]
```

**Aksiyon:**
- Yapay zekaya gönderilen **sistem promptu** güncellenecek; format açıkça ve örneklerle (few-shot) belirtilecek.
- Model çıktısının bu yapıya uyup uymadığını doğrulamak için bir **format doğrulama katmanı** (regex veya basit parser) eklenmesi önerilir — model formattan saptığında ya yeniden deneme (retry) tetiklenir ya da en azından loglanır.
- Mevcut ekran görüntüsündeki çıktı formatı (madde madde "Adım 1, Adım 2...", emoji başlıklı bölümler) ile hedef format karşılaştırılıp geçiş planı netleştirilecek — mevcut kullanıcılar için ani ve kırıcı bir değişiklik olmaması adına A/B test veya kademeli geçiş düşünülebilir.

**Kabul Kriterleri:**
- [ ] Yeni sistem promptu ile üretilen 20+ örnek çıktı, hedef formata uyuyor.
- [ ] Format dışı çıktı oranı ölçülüyor ve kabul edilebilir eşiğin (örn. <%5) altında.
- [ ] Şık açıklamaları (A-E) her zaman eksiksiz üretiliyor.

---

## 3. Sistem ve Altyapı Görevleri (Backend / Yönetim)

### Görev 3.1: Admin Panelinin Geliştirilmesi

**Öncelik:** P3

**Detay:** Yarım kalmış/unutulmuş admin paneli tamamlanacak veya sıfırdan oluşturulacak.

**Kapsam Önerisi (netleştirilmesi gereken alt maddeler):**
- Kullanıcı yönetimi (listeleme, arama, engelleme/aktifleştirme)
- İçerik yönetimi (soru bankası, kategoriler, düzenleme)
- Kullanım istatistikleri (kaç soru çözüldü, aktif kullanıcı sayısı vb.)
- Yetkilendirme: Admin paneline yalnızca yetkili roldeki kullanıcılar erişebilmeli (role-based access control).

**Aksiyon:**
- Gerekli API endpoint'leri (CRUD işlemleri) tanımlanacak ve güvenlik katmanı (authentication + authorization) eklenecek.
- Panel arayüzü, mevcut teknoloji yığınıyla tutarlı şekilde geliştirilecek.

**Not:** Bu görevin kapsamı geniş olduğundan, ayrı bir alt görev listesi (ticket breakdown) çıkarılması önerilir.

**Kabul Kriterleri:**
- [ ] Yetkisiz kullanıcılar panele erişemiyor.
- [ ] Temel kullanıcı ve içerik yönetimi işlemleri panel üzerinden yapılabiliyor.

---

### Görev 3.2: API Limit ve Kota Yönetimi

**Öncelik:** P0 (Kritik — uygulamanın tamamen kilitlenmesine neden oluyor)

**Detay:** Kullanılan yapay zeka servisinin (veya başka bir dış servisin) kotası bittiğinde uygulama işlevsiz kalıyor.

**Aksiyon:**
1. **Acil:** İlgili servis sağlayıcısında (örn. Anthropic/OpenAI vb.) kota/billing limiti artırılacak.
2. **Kalıcı çözüm:**
   - Kota kullanım oranını izleyen bir **rate-limiting / alerting mekanizması** kurulacak (örn. günlük/aylık kullanım %80'e ulaştığında ekibe otomatik bildirim — e-posta/Slack).
   - Kota bittiğinde kullanıcıya teknik hata yerine anlaşılır bir mesaj gösterilecek ("Şu anda yoğunluk nedeniyle hizmet veremiyoruz, lütfen daha sonra tekrar deneyin" gibi), sessiz başarısızlık (silent failure) engellenecek.
   - Mümkünse **fallback stratejisi** değerlendirilecek (örn. birincil model limitine ulaşıldığında ikincil bir modele geçiş).

**Kabul Kriterleri:**
- [ ] Kota %80'e ulaştığında ekip otomatik uyarı alıyor.
- [ ] Kota tükendiğinde kullanıcı deneyimi zarif şekilde bozuluyor (crash değil, anlaşılır mesaj).
- [ ] Kota/kullanım geçmişi loglanıyor ve gerektiğinde raporlanabiliyor.

---

## 4. Açık Sorular / Netleştirilmesi Gerekenler

Aşağıdaki noktalar, görev kartlarına dökülmeden önce netleştirilmeli:

1. **Teknoloji yığını teyidi:** Frontend React/React Native mi, yoksa farklı bir framework mü (Flutter, native iOS/Swift + Android/Kotlin)? Bu, Görev 1.1 ve 1.2'deki teknik önerileri doğrudan etkiler.
2. **Admin paneli kapsamı (Görev 3.1):** Hangi modüller öncelikli (kullanıcı yönetimi mi, içerik yönetimi mi)? Ayrı bir keşif toplantısı önerilir.
3. **Yapay zeka servis sağlayıcısı ve mevcut kota planı (Görev 3.2):** Hangi servis kullanılıyor ve mevcut limit nedir? Fallback modeli var mı/olmalı mı?
4. **Görev 2.3 geçiş stratejisi:** Format değişikliği tüm kullanıcılara aynı anda mı uygulanacak, yoksa kademeli mi?

---

## 5. Önerilen Sprint Dağılımı (Taslak)

| Sprint | Görevler |
|---|---|
| Sprint 1 | 3.2 (Acil kota artışı + uyarı mekanizması), 1.2 (Şık kayma — tüm cihazlar) |
| Sprint 2 | 1.1 (Zoom + Tam Ekran), 2.3 (Format standardizasyonu) |
| Sprint 3 | 2.1 (PDF kalitesi), 2.2 (Tek ekrana sığdırma — 1.1 ile entegre test) |
| Sprint 4+ | 3.1 (Admin paneli — kapsam netleştikten sonra) |

---

**Geliştirici Notu:** Bu plan, abinle aranızdaki iş bölümüne ve uygulamanın teknoloji yığınına uygun şekilde görev kartlarına (Jira/Trello/Linear vb.) dönüştürülmeye hazırdır. Açık sorular (Bölüm 4) netleştikçe ilgili görevler güncellenmelidir.
