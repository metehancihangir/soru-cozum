# Yapay Zeka Önbellekleme ve İçerik Yönetimi İyileştirmeleri — Implementasyon Planı

**Hazırlayan:** Teknik Ekip
**Tarih:** 24 Temmuz 2026
**Durum:** Taslak — Görev kartlarına dönüştürülmeye hazır
**Kapsam:** Bu belge, önceki planlardan (`implementasyon-plani-v2.md`, `implementasyon-plani-admin-ve-dashboard.md`) bağımsız, yeni bir iyileştirme setini kapsar. **Not:** Daha önce değerlendirilen "soru ID'lerinin 1'den başlatılması" görevi, veri bütünlüğü riski nedeniyle **bu aşamada ertelenmiştir** ve bu belgeye dahil edilmemiştir.

---

## 1. Yapay Zeka Açıklamalarının Veritabanında Önbelleğe Alınması

**Öncelik:** P1
**Amaç:** API token kullanımını önemli ölçüde azaltmak.

### 1.1 Sorun

Şu anda bir kullanıcı bir soruya yanlış cevap verip "Yapay Zekaya Sor" seçeneğini kullandığında, sistem her seferinde yapay zeka servisine yeni bir istek gönderiyor — aynı soru için daha önce üretilmiş bir açıklama olsa bile. Bu, gereksiz API çağrılarına ve dolayısıyla gereksiz token tüketimine yol açıyor.

### 1.2 Aksiyon

- Bir kullanıcı bir soruya yanlış cevap verip yapay zeka açıklaması talep ettiğinde, üretilen cevap **veritabanına kaydedilecek** (soru ID'siyle ilişkilendirilmiş bir "açıklama" tablosunda).
- Aynı soru için bir sonraki "Yapay Zekaya Sor" talebinde — ister aynı kullanıcı ister farklı bir kullanıcı olsun — sistem önce veritabanında bu soruya ait kayıtlı bir açıklama olup olmadığını kontrol edecek:
  - **Varsa:** Kayıtlı açıklama doğrudan döndürülecek, yapay zeka servisine yeni bir istek gönderilmeyecek.
  - **Yoksa:** Normal akışta olduğu gibi yapay zekaya istek gönderilecek ve sonuç veritabanına kaydedilecek.

### 1.3 Kabul Kriterleri

- [ ] Bir soruya ilk kez yapay zeka açıklaması istendiğinde, sonuç veritabanına kaydediliyor.
- [ ] Aynı soruya farklı bir kullanıcı tarafından tekrar "Yapay Zekaya Sor" denildiğinde, yeni bir API çağrısı yapılmadan kayıtlı açıklama gösteriliyor.
- [ ] Bu davranış, farklı oturumlar ve farklı kullanıcı hesapları arasında tutarlı çalışıyor.

---

## 2. Farklı Yıllarda Tekrar Eden Soruların Ortak Önbelleğe Bağlanması

**Öncelik:** P1
**Bağlam:** Uygulamadaki sorular gerçek/çıkmış sınav sorularından oluştuğu için, bir yılda sorulan bir soru başka bir yılda da (bazen birebir aynı içerikle) tekrar sorulabiliyor. Bu durumda teknik olarak iki farklı soru kaydı (farklı ID, farklı yıl) aslında **içerik olarak aynı soruyu** temsil ediyor. Bölüm 1'deki önbellekleme mekanizmasının bu tür soruları da kapsayabilmesi için, admin'in bu soruları "aynı soru" olarak işaretleyebilmesi ve bunların ortak bir önbelleğe bağlanması gerekiyor.

### 2.1 Önerilen Teknik Çözüm — "Soru Grubu" (Question Group) Yapısı

Bu ihtiyacı çözmenin en sürdürülebilir yolu, yapay zeka açıklamasını doğrudan tekil soru ID'sine değil, bir **soru grubuna** bağlamaktır:

1. **Veri modeli:** Her soruya bir `group_id` alanı eklenir. Varsayılan olarak her sorunun `group_id`'si kendi ID'sine eşittir (yani başlangıçta her soru kendi başına tek kişilik bir gruptur).
2. **Admin panelinde "Aynı Soru Olarak İşaretle" özelliği:** Admin, içerik yönetimi ekranında farklı yıllara ait birden fazla soruyu seçip "Bunlar Aynı Soru" işlemini uyguladığında, sistem seçilen soruların tamamının `group_id` değerini **ortak bir değere** günceller (örn. seçilenler arasındaki en düşük ID referans alınabilir).
3. **Açıklama tablosunun anahtar alanı:** Yapay zeka açıklamalarının tutulduğu tabloda anahtar alan, tekil soru ID'si yerine `group_id` olacak şekilde güncellenir. Sorgu mantığı şu şekilde işler: *"Bu sorunun bağlı olduğu `group_id` için daha önce üretilmiş bir açıklama var mı?"* Varsa doğrudan döndürülür; yoksa yapay zekaya sorulup sonuç o `group_id` altında kaydedilir.
4. **Sonuç:** Örneğin bir kullanıcı 2022 yılındaki bir soruya yanlış cevap verip açıklama ürettikten sonra, başka bir kullanıcı 2026 yılındaki (aynı gruba bağlı) soruya yanlış cevap verip açıklama istediğinde, sistem doğrudan 2022'de üretilmiş açıklamayı döndürür — yeni bir API çağrısı yapılmaz.
5. **Önbellek temizleme (önerilir):** İleride bir sorunun içeriği güncellenirse (örn. bir yazım hatası düzeltilirse), o gruba ait önbellekteki açıklamanın güncel olmayan bir cevap döndürmeye devam etmemesi için, admin panelinde ilgili grubun önbelleğini **manuel olarak temizleyip yeniden ürettirebileceği** bir "Önbelleği Temizle" seçeneği eklenmesi önerilir.

### 2.2 Kabul Kriterleri

- [ ] Admin panelinde birden fazla soru (farklı yıllardan) seçilip "aynı soru" olarak işaretlenebiliyor.
- [ ] Aynı gruba bağlı sorulardan herhangi birinde üretilen açıklama, gruptaki diğer tüm sorular için de otomatik olarak geçerli oluyor.
- [ ] Grup içindeki herhangi bir soruya yanlış cevap verildiğinde, önbellekte kayıt varsa yeni bir API çağrısı yapılmıyor.
- [ ] (Opsiyonel) Admin, bir grubun önbelleğini manuel olarak temizleyip yeniden üretilmesini tetikleyebiliyor.

### 2.3 Teknik Notlar / Riskler

- `group_id` alanının varsayılan davranışı (her soru kendi ID'siyle başlar) sayesinde, mevcut sorular üzerinde herhangi bir veri kaybı veya bozulma riski oluşmaz — bu değişiklik geriye dönük uyumludur.
- Admin'in "aynı soru" eşleştirmesini yaparken yanlışlıkla farklı iki soruyu birleştirmesi riskine karşı, işlem öncesi bir onay adımı (örn. seçilen soruların görsellerinin yan yana gösterildiği bir karşılaştırma ekranı) eklenmesi önerilir.

---

## 3. İçerik Yönetiminde Soru Görseline Tıklayınca Büyük Önizleme

**Öncelik:** P2

### 3.1 Sorun

Admin panelinin içerik yönetimi ekranında sorular küçük (thumbnail) görsellerle listeleniyor; ancak bu küçük görsele tıklandığında sorunun büyük/okunabilir halini görebilmek mümkün değil.

### 3.2 Aksiyon

- Listelenen her soru thumbnail'ine tıklandığında, sorunun **tam boyutlu görseli** bir modal/lightbox pencerede açılacak.
- Pencere; sağ üstteki "X" butonu, pencere dışına tıklama veya `ESC` tuşu ile kapatılabilecek.
- Görsel, mevcut boyutundan daha büyük gösterilirken netliğini korumalı (gerekirse Görev 2.1'deki PDF/görsel kalite iyileştirmeleriyle tutarlı bir çözünürlükte saklanan orijinal görsel kullanılmalı).

### 3.3 Kabul Kriterleri

- [ ] Soru thumbnail'ine tıklandığında, görselin büyük/net versiyonu bir pencerede açılıyor.
- [ ] Pencere; X butonu, dışarı tıklama ve ESC tuşuyla kapatılabiliyor.
- [ ] Büyütülmüş görsel bulanıklaşmıyor.

---

## 4. Sprint Önerisi (Taslak)

| Sprint | Görevler |
|---|---|
| Sprint 1 | Bölüm 1 (Tekil soru önbellekleme) |
| Sprint 2 | Bölüm 2 (Soru grubu yapısı + admin "aynı soru" işaretleme) |
| Sprint 3 | Bölüm 3 (Görsel büyük önizleme — düşük riskli, istenirse önceki sprintlerle paralel de alınabilir) |

---

## 5. Ertelenen Konu

- **Soru ID numaralandırmasının 1'den başlatılması:** Veritabanındaki gerçek birincil anahtarların (ID) değiştirilmesi, ilişkili tüm kayıtların (kullanıcı geçmişi, istatistikler, bu belgede tanımlanan `group_id` alanı vb.) tutarlı şekilde güncellenmesini gerektirdiğinden risk taşıyor. Bu görev şimdilik ertelenmiştir; ileride ele alınmak istenirse, gerçek ID'ye dokunmadan yalnızca arayüzde 1'den başlayan bir "görüntüleme numarası" gösterilmesi, daha düşük riskli bir alternatif olarak değerlendirilebilir.

---

**Geliştirici Notu:** Bu plan, önceki iki plana (`implementasyon-plani-v2.md`, `implementasyon-plani-admin-ve-dashboard.md`) ek olarak hazırlanmıştır. Bölüm 2'deki soru grubu yapısı geliştirilirken, mevcut veri modeliyle (özellikle admin panelindeki soru listeleme/filtreleme yapısıyla) uyumluluğun gözden geçirilmesi önerilir.
