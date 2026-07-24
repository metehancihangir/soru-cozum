# Admin Paneli ve Dashboard İyileştirmeleri — Implementasyon Planı

**Hazırlayan:** Teknik Ekip
**Tarih:** 24 Temmuz 2026
**Durum:** Taslak — Görev kartlarına dönüştürülmeye hazır
**Kapsam:** Bu belge, önceki genel UI/UX planından (`implementasyon-plani-v2.md`) **bağımsız** olarak hazırlanmıştır ve şu üç ana konuya odaklanır:
1. Admin paneline soru ekleme/silme akışı (PDF tabanlı, uygulama içi kırpma)
2. Admin paneli kimlik doğrulama sisteminin (kullanıcı adı + şifre, çoklu admin yönetimi) kurulması
3. Dashboard / Performans Analizi ekranındaki mobil (Android) UX sorunları

**Referans Görsel:** `WhatsApp_Image_2026-07-24_at_10_55_44.jpeg` (Android'de Performans Analizi ekranı)

---

## 1. Admin Paneli — Kimlik Doğrulama ve Çoklu Admin Yönetimi

**Öncelik:** P1

### 1.1 Mevcut Durum ve Sorun

Şu anda admin paneline girişte yalnızca **şifre** isteniyor; kullanıcı adı alanı yok. Bu hem güvenlik açısından zayıf (tek faktörlü, kimin giriş yaptığı belli değil) hem de birden fazla admin olduğunda kim neyi yaptığını takip etmeyi imkansız kılıyor.

### 1.2 Aksiyon

**a) Giriş ekranına kullanıcı adı alanı eklenmesi**
- Giriş formu artık `kullanıcı adı` + `şifre` ikilisiyle çalışacak.
- Backend'de kimlik doğrulama, kullanıcı adına göre kayıt bulup şifre hash'ini (bcrypt/argon2 gibi) karşılaştıracak şekilde güncellenecek. **Şifreler asla düz metin olarak veritabanında tutulmayacak.**

**b) Ana (root) admin hesabının oluşturulması (seed data)**
- Sistem ilk kurulduğunda veya migration çalıştığında aşağıdaki hesap otomatik oluşturulacak:
  - **Kullanıcı adı:** `admin`
  - **Şifre:** `admin2026` (hash'lenmiş olarak saklanacak)
- Bu hesap `super_admin` rolüne sahip olacak (aşağıdaki rol yapısına bakınız).
- **Karar (netleşti):** `admin2026` gibi bir varsayılan şifrenin üretim ortamında kalıcı kalması risklidir. Bu nedenle **ilk girişte şifre değiştirme zorunluluğu uygulanacaktır** — bu artık opsiyonel değil, gereksinimdir:
  - Kullanıcı kaydında bir `force_password_change` (boolean) bayrağı tutulacak; `admin` hesabı için bu bayrak `true` olarak başlayacak.
  - Bayrak `true` iken kullanıcı, giriş yaptıktan sonra herhangi bir panel ekranına erişmeden önce **zorunlu bir "Şifre Değiştir" ekranına** yönlendirilecek.
  - Yeni şifre belirlendikten sonra bayrak `false`'a çekilecek ve kullanıcı normal panel akışına devam edebilecek.

**c) Panel içinden yeni admin ekleyebilme**
- Giriş yapan admin (yetkisi varsa), panel içinde "Yeni Admin Ekle" formuyla:
  - Kullanıcı adı
  - Geçici/ilk şifre
  - Rol (bkz. aşağıda)
  atayabilecek.
- Yeni eklenen admin hesapları da `force_password_change = true` ile oluşturulacak; yani her yeni admin, ilk girişinde kendi şifresini değiştirmek zorunda kalacak (ana admin hesabıyla aynı kural).

**d) Basit Rol Yapısı (öneri)**
| Rol | Yetkiler |
|---|---|
| `super_admin` | Her şeyi yapabilir — yeni admin ekleme/silme dahil |
| `admin` | Soru ekleme/silme, yıl/ders/dönem yönetimi — başka admin ekleyemez |

- Bu ayrım, ileride "her admin her şeyi yapabiliyor" durumunun getireceği kaza riskini (örn. yanlışlıkla başka admin silme) azaltır.

**e) Admin işlem kayıtları (audit log) — önerilir**
- Hangi admin, ne zaman, hangi soruyu ekledi/sildi gibi temel bir işlem kaydı tutulması önerilir. Bu, ileride bir hata olduğunda ("bu soru neden silinmiş?") geriye dönük inceleme imkanı sağlar. İlk versiyon için opsiyonel, ama düşük maliyetli olduğu için eklenmesi tavsiye edilir.

### 1.3 Kabul Kriterleri
- [ ] Giriş ekranında kullanıcı adı + şifre alanı var, sadece şifreyle giriş kapatıldı.
- [ ] `admin` / `admin2026` hesabı sistemde mevcut ve `super_admin` yetkisine sahip.
- [ ] `super_admin` rolündeki kullanıcı panelden yeni admin ekleyebiliyor.
- [ ] Şifreler veritabanında hash'lenmiş olarak tutuluyor (düz metin değil).
- [ ] `admin` rolündeki bir kullanıcı yeni admin ekleyemiyor (yetkisiz erişim engelleniyor).
- [ ] `admin` hesabı ilk girişte doğrudan panele değil, zorunlu "Şifre Değiştir" ekranına yönlendiriliyor; şifre değiştirilmeden panelin diğer kısımlarına erişilemiyor.
- [ ] Yeni oluşturulan her admin hesabı için aynı zorunlu şifre değiştirme akışı çalışıyor.

### 1.4 Açık Sorular
- Admin şifresi unutulursa sıfırlama akışı nasıl olacak (e-posta yok gibi görünüyor — bu durumda yalnızca `super_admin` diğer adminlerin şifresini sıfırlayabilir mi)? *(Bu belgedeki diğer tüm açık sorular netleşmiştir; bkz. Bölüm 5 — Kararlar.)*

---

## 2. Admin Paneli — Soru Ekleme/Silme (Yaklaşım 2: PDF Yükle + Uygulama İçinde Kırp)

**Öncelik:** P1

### 2.1 Genel Akış Özeti

Admin, tek tek görsel yüklemek yerine **tüm PDF'i tek seferde yükler**; uygulama PDF sayfalarını ekranda gösterir, admin her soru için bir dikdörtgen çizerek seçer, sistem o alanı otomatik kırpıp görsele dönüştürür ve admin aynı ekranda metadata'yı (yıl, ders, dönem) girip kaydeder. Bu, önceki konuşmada değerlendirilen 3 yaklaşımdan (tek tek görsel / PDF + uygulama içi kırpma / tam otomatik AI tespiti) **orta zorluk, düşük admin iş yükü** dengesini sağlayan seçenektir.

### 2.2 Adım Adım Teknik Akış

**Adım 1 — PDF Yükleme**
- Admin panelinde "Yeni Sınav/Soru Seti Yükle" ekranı: PDF dosyası seçilir ve sunucuya yüklenir.
- Dosya boyutu limiti ve yalnızca `.pdf` uzantısına izin verilmesi (basit validasyon) eklenecek.

**Adım 2 — PDF'in Ekranda Görüntülenmesi**
- Yüklenen PDF, `pdf.js` (Mozilla'nın açık kaynak kütüphanesi) kullanılarak bir `<canvas>` üzerinde sayfa sayfa render edilecek.
- Admin sayfalar arasında ileri/geri gezinebilecek (çok sayfalı sınavlar için).

**Adım 3 — Soru Alanının Seçilmesi (Kırpma)**
- Canvas üzerine, admin fare (masaüstü) veya parmakla (tablet/touchscreen) sürükleyerek bir dikdörtgen çizecek — bu dikdörtgen ilgili sorunun (soru metni + şıklar dahil) sınırlarını belirtir.
- Dikdörtgenin köşe noktaları küçük tutamaçlarla (handle) ayarlanabilir olacak — admin seçimi hassas şekilde düzeltebilecek.
- "Kırp ve Kaydet" butonuna basıldığında, seçilen alan canvas'tan bir görsel (PNG/JPEG blob) olarak çıkarılacak (`canvas.toDataURL()` veya `toBlob()`).

**Adım 4 — Metadata Girişi (Aynı Ekranda)**
- Kırpma işleminin hemen ardından, admin küçük bir form üzerinden şu bilgileri girecek:
  - **Yıl** (bkz. Bölüm 2.3 — dinamik yıl ekleme)
  - **Ders** (Arapça-2, Arapça-4 vb. — sabit/statik dropdown listesi)
  - **Dönem Türü** (Dönem Sonu / Yaz Okulu — dropdown)
  - **Doğru Cevap** (A-E)
  - (Opsiyonel) Konu/etiket — bkz. Bölüm 4'teki "Yanlış Yaptığın Konular" ile ilişkisi
- "Kaydet" ile soru, kırpılmış görseliyle birlikte veritabanına eklenir.

**Adım 5 — Sıradaki Soruya Geçiş**
- Kaydedildikten sonra admin aynı sayfada kalır, yeni bir dikdörtgen çizip bir sonraki soruyu seçmeye devam eder. Böylece tüm sınav tek oturumda, uygulamadan çıkmadan işlenebilir.

**Adım 6 — Soru Silme**
- Mevcut soruların listelendiği bir ekranda (yıl/ders/dönem'e göre filtrelenebilir), her sorunun yanında bir "Sil" butonu bulunacak. Silme işlemi onay penceresi (confirmation modal) ile korunacak — yanlışlıkla silmeyi önlemek için.
- **Karar (netleşti):** Soru silme **kalıcı (hard delete)** olacak; "arşivleme" veya "soft delete" gibi bir ara mekanizma **gerekli değildir**. Soru silindiğinde, o soruya bağlı geçmiş kullanıcı istatistiklerinin (örn. daha önce o soruyu yanlış yapmış kullanıcıların "Yanlış Yaptığın Konular" verisi) etkilenmesi konusu önemsenmemektedir — bu işlem çok nadir gerçekleşeceği için veri bütünlüğü açısından ek bir karmaşıklığa gerek görülmemiştir. Basitlik için soru kaydı ve ilişkili görsel doğrudan veritabanından/depolamadan kaldırılacaktır.

### 2.3 Dinamik Yıl / Ders / Dönem Yapısı

Admin, uygulamada henüz olmayan bir yılı (örn. 2027) eklemek istediğinde bu yılın seçeneklerde görünür hale gelmesi isteniyor. Bu klasik bir **hiyerarşik taksonomi** yapısıyla çözülür:

```
Yıl (örn. 2027)
 └── Ders (örn. Arapça-2, Arapça-4, ...)
      └── Dönem Türü (Dönem Sonu / Yaz Okulu)
           └── Sorular
```

**Karar (netleşti):** Yalnızca **Yıl** dinamik olacak; **Ders** listesi sabit (statik) kalacaktır.

**Aksiyon:**
- Admin panelinde "Yıl Ekle" butonu: yeni bir yıl kaydı (örn. `2027`) veritabanına eklenir.
- Yeni eklenen yıl, soru ekleme formundaki "Yıl" dropdown'unda **anında** görünür hale gelir (sayfa yenilemeden, canlı güncelleme).
- **Ders listesi sabit kodlanmış olarak kalacak** (örn. `Arapça-2`, `Arapça-4` ve ihtiyaç duyulan diğer sabit dersler). Admin panelinden yeni ders ekleme/silme özelliği bu kapsamda **geliştirilmeyecektir** — yeni bir ders eklenmesi gerektiğinde bu, kod tarafında yapılacak bir değişiklik olacaktır. (İleride ihtiyaç değişirse, bu yapı yıl gibi dinamik hale getirilebilir; ancak şu an için kapsam dışıdır.)
- Dönem Türü (`Dönem Sonu`, `Yaz Okulu`) da sabit iki seçenek olarak kalacak.

**Kabul Kriterleri:**
- [ ] Admin panelinden PDF yüklenebiliyor ve sayfalar ekranda görüntüleniyor.
- [ ] Admin, canvas üzerinde dikdörtgen çizerek bir soruyu seçip kırpabiliyor.
- [ ] Kırpılan görsel + metadata (yıl/ders/dönem/doğru cevap) tek adımda kaydediliyor.
- [ ] Admin, uygulamada olmayan yeni bir yılı ("2027" gibi) ekleyebiliyor ve bu yıl anında dropdown'larda seçilebilir hale geliyor.
- [ ] Ders dropdown'u sabit listeden geliyor; panelde "ders ekle" gibi bir seçenek bulunmuyor (kasıtlı olarak kapsam dışı).
- [ ] Sorular yıl/ders/dönem'e göre filtrelenip listelenebiliyor ve onay adımından geçerek silinebiliyor.
- [ ] Bir PDF'teki tüm sorular, uygulamadan çıkmadan tek oturumda işlenebiliyor.

### 2.4 Teknik Riskler / Notlar
- `pdf.js` büyük/çok sayfalı PDF'lerde performans testi gerektirir (özellikle mobil admin kullanımı düşünülüyorsa — ama bu ekranın öncelikli olarak masaüstünde kullanılması daha olasıdır).
- Kırpılan görsellerin sunucu tarafında da makul bir sıkıştırma/boyutlandırma standardına oturtulması önerilir (tutarlı dosya boyutu ve kalite için — bkz. önceki plandaki PDF/görsel kalitesi görevleriyle çelişmeyecek şekilde).

---

## 3. Dashboard / Performans Analizi — Mobil (Android) UX Düzeltmeleri

**Öncelik:** P0 (kullanıcı temel bir işlevi — sayfayı ilerletmeyi — zar zor gerçekleştirebiliyor)
**Referans:** `WhatsApp_Image_2026-07-24_at_10_55_44.jpeg`

### 3.1 Sorun 1 — "İleri" (Next) Butonuna Ulaşılamıyor / Kaydırma Sorunu

**Gözlem:** Performans Analizi ekranının altında mavi bir "İleri" butonu bulunuyor, ancak Android cihazda sayfa bu butona kadar kaydırılamıyor; kullanıcı yalnızca tarayıcıda zoom'u azaltarak (sayfayı küçülterek) butona dokunabiliyor. Bu, temel bir navigasyon adımını neredeyse kullanılamaz hale getiriyor.

**Olası Kök Nedenler (kod incelemesi ile teyit edilmeli):**
- Sayfanın kaydırılabilir alanı (`overflow-y`) yanlış bir container'a (örn. iç div yerine dış wrapper'a) uygulanmış olabilir, bu da içeriğin tamamının kaydırma alanına dahil olmamasına yol açar.
- Buton, `position: fixed` veya `sticky` ile ekrana sabitlenmiş olabilir ama mobilde tarayıcı adres çubuğu/klavye gibi dinamik UI elemanları yüzünden viewport yüksekliği (`100vh`) yanlış hesaplanıyor olabilir — bu Android Chrome'da bilinen bir sorundur (`100vh` gerçek görünür alanı değil, tarayıcı çubuğu dahil/hariç farklı şekilde hesaplanabilir).
- Sayfanın en altında yeterli boşluk (padding-bottom) bırakılmamış olabilir, böylece buton içerik akışının dışında/altında kalıyor olabilir.

**Karar (netleşti — sticky footer yaklaşımı):**
İki seçenek değerlendirildi: (a) sayfanın mevcut kaydırma davranışını `100dvh`/padding düzeltmeleriyle onarmak, veya (b) butonu ekranın altına sabit (sticky) bir footer olarak yerleştirmek. **Sticky footer yaklaşımı tercih edilmiştir**, çünkü:
- İçerik uzunluğu (örn. "Yanlış Yaptığın Konular" listesi ne kadar uzarsa uzasın) değiştikçe butonun konumu risk altına girmez — buton her zaman ekranın altında, sabit ve görünür kalır.
- Yalnızca bu ekrana özgü değil, ileride benzer "alt aksiyon butonu" gerektiren tüm ekranlarda tekrar kullanılabilecek genel bir çözüm sağlar (örn. bir `<StickyFooterButton>` bileşeni).
- `100vh`/`100dvh` gibi tarayıcıya özgü viewport hesaplama tuhaflıklarına bağımlılığı ortadan kaldırır; bu tür CSS birim sorunları farklı Android tarayıcı sürümlerinde farklı davranabildiğinden, sticky footer daha öngörülebilir ve bakımı daha kolay bir çözümdür.

**Aksiyon:**
- İçerik alanı (başlıklar, konu listesi vb.) kendi içinde normal şekilde kayan (scrollable) bir bölge olacak; "İleri" butonu ise bu kayan alanın **dışında**, ekranın en altına sabitlenmiş (`position: sticky` veya `fixed`, `bottom: 0`) ayrı bir footer bileşeni olarak yerleştirilecek.
- İçerik alanına, sticky footer'ın buton yüksekliği kadar bir `padding-bottom` eklenecek — böylece kaydırma sırasında son içerik satırı butonun altında/arkasında kalmayacak.
- Sticky footer'ın arka planı, altındaki kayan içerikle karışmaması için hafif bir gölge veya arka plan rengiyle görsel olarak ayrıştırılacak.
- Bu değişiklik yalnızca bu ekranla sınırlı kalmayacak; ileride benzer "alt aksiyon butonu" ihtiyacı olan diğer ekranlarda da aynı bileşen tekrar kullanılabilecek şekilde genel (reusable) olarak tasarlanacak.

**Kabul Kriterleri:**
- [ ] Android Chrome'da (ve mümkünse birkaç farklı ekran boyutunda) "İleri" butonuna normal zoom seviyesinde, ek bir işlem yapmadan dokunulabiliyor.
- [ ] Sayfa kaydırıldığında tüm içerik + buton sorunsuz görüntüleniyor, hiçbir eleman viewport dışında "kayıp" kalmıyor.
- [ ] iOS Safari'de de aynı senaryo test edilip regresyon olmadığından emin olunuyor.

### 3.2 Sorun 2 — Başlıkların Yerleşimi ve Tipografi Sorunu ("Yanlış Yaptığın Konular")

**Gözlem:** "YANLIŞ YAPTIĞIN KONULAR" başlığı ekranda gereğinden fazla yukarıda ve boşluklu duruyor; hemen altında olması beklenen ilgili liste (kullanıcının deneyimine göre muhtemelen "Anlamadığın Konular" gibi bir bölüm) başlıkla görsel olarak yeterince ilişkilendirilmemiş. Font kullanımı (büyük harf + geniş harf aralığı - letter-spacing) başlığı içerikten kopuk hissettiriyor.

**Aksiyon:**
- Başlık ile altındaki içerik arasındaki boşluk (`margin-bottom` üstte, `margin-top` altta) azaltılıp, başlık ve ilişkili içeriğin görsel olarak **bir grup** oluşturduğu net hale getirilecek (başlığa yakın, bir sonraki bölümden belirgin şekilde ayrı).
- Genel bölüm hiyerarşisi gözden geçirilecek: Eğer sırasıyla "Yanlış Yaptığın Konular" ve "Anlamadığın Konular" gibi iki ayrı blok varsa, bu iki blok arasında tutarlı ve yeterli bir ayraç/boşluk standardı (örn. bölümler arası sabit bir `margin` değeri) tanımlanacak — şu anki gibi bir başlığın "havada kalmış" gibi durmaması için.
- Başlık tipografisi (font-size, letter-spacing, font-weight) tüm başlıklarda tutarlı bir stil rehberine (design system / stil kılavuzu) bağlanacak; şu anki serbest/tutarsız görünüm yerine, örneğin: `font-size: 20px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px;` gibi standart bir kural belirlenip tüm başlıklara uygulanacak.
- Bu düzeltme yapılırken yalnızca bu ekran değil, dashboard'daki benzer başlık-içerik blokları da (örn. "TOPLAM YANLIŞ" başlığı, yıl accordion'ları) aynı stil standardına göre gözden geçirilecek — tutarlılık için.

**Kabul Kriterleri:**
- [ ] "Yanlış Yaptığın Konular" başlığı ile hemen altındaki ilgili içerik arasında görsel olarak net bir grup ilişkisi var (boşluk azaltıldı).
- [ ] Farklı bölümler (örn. bir sonraki başlık grubu) arasında tutarlı ve yeterli bir ayrım boşluğu var.
- [ ] Başlık tipografisi (font boyutu, kalınlığı, harf aralığı) dashboard genelinde tutarlı.
- [ ] Değişiklik Android'de (referans görselin alındığı cihaz türü) ve iOS'ta karşılaştırmalı olarak test edildi.

---

## 4. Sprint Önerisi (Taslak)

| Sprint | Görevler |
|---|---|
| Sprint 1 | 3.1 (İleri butonu — sticky footer çözümü, P0), 1 (Admin kimlik doğrulama: kullanıcı adı + şifre + seed admin hesabı + **zorunlu ilk şifre değiştirme**) |
| Sprint 2 | 2 (PDF yükle + uygulama içi kırpma akışı — soru ekleme), yıl dinamik yapı (ders sabit liste) |
| Sprint 3 | 1.2c (Çoklu admin ekleme + rol yönetimi), 3.2 (Başlık/tipografi düzeltmeleri) |
| Sprint 4 | Audit log (opsiyonel) |

---

## 5. Kararlar (Önceki Açık Sorulara Yanıtlar)

Önceki taslakta yer alan açık sorular netleşmiştir:

1. **İlk şifre değiştirme zorunluluğu:** Uygulanacak. `admin` hesabı ve panelden eklenen tüm yeni adminler, ilk girişte zorunlu bir "Şifre Değiştir" ekranından geçecek (bkz. Bölüm 1.2b/1.2c).
2. **"İleri" butonu çözümü:** Sticky footer yaklaşımı seçildi — buton, kayan içerik alanının dışında, ekranın altında sabit bir bileşen olarak yeniden konumlandırılacak (bkz. Bölüm 3.1).
3. **Ders listesi:** Sabit (statik) liste olarak kalacak; yalnızca **Yıl** admin panelinden dinamik olarak eklenebilecek (bkz. Bölüm 2.3).
4. **Soru silme ve geçmiş istatistikler:** Soru silme kalıcı (hard delete) olacak; geçmiş kullanıcı istatistiklerinin bu silmeden etkilenmesi önemsenmeyecek, çünkü soru silme çok nadir bir işlem olarak öngörülüyor (bkz. Bölüm 2.2, Adım 6). Soft delete/arşivleme mekanizması **kapsam dışıdır**.

**Kalan tek açık soru:** Admin şifresi unutulursa sıfırlama akışı nasıl olacak (bkz. Bölüm 1.4) — bu, e-posta/SMS altyapısı olup olmamasına bağlı olduğundan ayrıca netleştirilmesi gerekiyor.

---

**Geliştirici Notu:** Bu plan, önceki genel UI/UX planına (`implementasyon-plani-v2.md`) ek olarak hazırlanmıştır; ikisi birlikte tüm backlog'u oluşturur. Açık sorular (Bölüm 5) netleştikçe ilgili görevler güncellenmelidir.
