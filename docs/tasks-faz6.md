# ✅ FAZ 6 — Görev Listesi: Test ve Doğrulama

> **Kaynak:** [roadmap-arabic-quiz.md — FAZ 6](../roadmap-arabic-quiz.md#-faz-6--test-ve-doğrulama)
> **Hedef:** API, frontend ve Arapça karakter bütünlüğü için sistematik test senaryolarını çalıştırmak; sonuçları doğrulanabilir hale getirmek.
> **Tahmini süre:** 1-2 saat
> **Ön koşul:** FAZ 5 tamamlanmış olmalı — RTL düzen, responsive görünüm ve temel quiz akışı çalışıyor.
> **Durum:** ⏳ PLANLANDI

---

## 1. Backend API Test Hazırlığı

- [x] **1.1** Swagger veya Postman üzerinden test çalıştırılacak ortamı belirle; backend base URL, Swagger URL ve kullanılan veritabanı adını not et. *(Roadmap Ref: §6.1 · Backend API Testleri - Swagger / Postman)*
- [x] **1.2** Teste başlamadan önce `Questions` tablosundaki mevcut kayıt durumunu kontrol et; boş DB ve dolu DB senaryoları için başlangıç verisini belgele. *(Roadmap Ref: §6.1 · T1 GET /api/questions)*
- [x] **1.3** API testlerinde kullanılacak geçerli Arapça soru payload'unu hazırla; `questionText`, `optionA-D`, opsiyonel `optionE`, `correctOption` ve `explanation` alanlarını içersin. *(Roadmap Ref: §6.1 · T2 POST /api/questions)*
- [x] **1.4** Negatif testler için eksik `questionText`, geçersiz `correctOption` ve olmayan ID değerleri gibi hata payload'larını hazırla. *(Roadmap Ref: §6.1 · T3, T5, T8)*

---

## 2. Backend API Test Matrisi

- [x] **2.1** `GET /api/questions` isteğini çalıştır; boş DB'de `200 OK` ve `[]`, dolu DB'de `200 OK` ve soru listesi döndüğünü doğrula. *(Roadmap Ref: §6.1 · T1)*
- [x] **2.2** Geçerli Arapça soru ile `POST /api/questions` isteğini çalıştır; `201 Created`, response body ve `Location` header değerini doğrula. *(Roadmap Ref: §6.1 · T2)*
- [x] **2.3** `questionText` eksik payload ile `POST /api/questions` isteğini çalıştır; `400 Bad Request` döndüğünü ve hata mesajının anlaşılır olduğunu doğrula. *(Roadmap Ref: §6.1 · T3)*
- [x] **2.4** Var olan ID ile `GET /api/questions/{id}` isteğini çalıştır; `200 OK` ve tek soru objesinin doğru alanlarla döndüğünü doğrula. *(Roadmap Ref: §6.1 · T4)*
- [x] **2.5** Olmayan ID, örn. `999`, ile `GET /api/questions/{id}` isteğini çalıştır; `404 Not Found` döndüğünü doğrula. *(Roadmap Ref: §6.1 · T5)*
- [x] **2.6** Var olan ID için güncellenmiş veriyle `PUT /api/questions/{id}` isteğini çalıştır; `204 No Content` döndüğünü ve sonraki GET'te verinin güncellendiğini doğrula. *(Roadmap Ref: §6.1 · T6)*
- [x] **2.7** Var olan ID ile `DELETE /api/questions/{id}` isteğini çalıştır; `204 No Content` döndüğünü ve sonraki GET'te kaydın bulunamadığını doğrula. *(Roadmap Ref: §6.1 · T7)*
- [x] **2.8** Silinmiş veya olmayan ID ile tekrar `DELETE /api/questions/{id}` isteğini çalıştır; `404 Not Found` döndüğünü doğrula. *(Roadmap Ref: §6.1 · T8)*
- [x] **2.9** T1-T8 sonuçlarını kısa bir test kayıt tablosuna işle; endpoint, giriş, beklenen sonuç, gerçek sonuç ve geçme/kalma durumunu yaz. *(Roadmap Ref: §6.1 · Kapsamlı Test Matrisi)*

---

## 3. SQL ve Encoding Doğrulaması

- [ ] **3.1** MySQL CLI veya Workbench üzerinden `SELECT Id, QuestionText FROM Questions WHERE Id = <testId>;` sorgusunu çalıştır; Arapça karakterlerin veritabanında bozulmadığını doğrula. *(Roadmap Ref: §6.1 · Arapça Karakter Bütünlüğü - SQL Doğrulama)*
- [ ] **3.2** `SHOW VARIABLES LIKE 'character_set%';` sorgusunu çalıştır; özellikle server, database, connection ve client karakter setlerini kaydet. *(Roadmap Ref: §6.1 · Encoding kontrolü)*
- [ ] **3.3** `SHOW CREATE TABLE Questions;` çıktısında tablo ve metin kolonlarının `utf8mb4` karakter setiyle uyumlu olduğunu doğrula. *(Roadmap Ref: §6.1 · Arapça Karakter Bütünlüğü - SQL Doğrulama)*
- [ ] **3.4** Swagger/Postman response JSON'undaki Arapça metin ile SQL çıktısındaki metni görsel olarak karşılaştır; bozulma, `?` karakteri veya mojibake olmadığını doğrula. *(Roadmap Ref: §6.1 · Arapça Karakter Bütünlüğü)*

---

## 4. React Component Testleri

- [x] **4.1** Mevcut bağımlılıklarla çalışan component logic test dosyasını oluştur; `src/components/questionCard.logic.test.js`. *(Roadmap Ref: §6.2 · React Component Testleri)*
- [x] **4.2** Test fixture olarak Arapça metinli soru hazırla; doğru cevap, yanlış cevap ve açıklama senaryolarında kullanılacak. *(Roadmap Ref: §6.2 · React Testing Library ile temel senaryolar)*
- [x] **4.3** Doğru şık seçilince ilgili buton class hesabının `correct` CSS class'ı ürettiğini test et. *(Roadmap Ref: §6.2 · "Doğru şık seçilince yeşil CSS class eklenir")*
- [x] **4.4** Yanlış şık seçilince seçilen buton için `wrong`, doğru şık için `correct` class hesabı üretildiğini test et. *(Roadmap Ref: §6.2 · "Yanlış şık seçilince kırmızı class eklenir")*
- [x] **4.5** Yanlış cevap sonrası doğru cevap bilgisini destekleyen class mantığını ve açıklama fixture'ını test kapsamına al. *(Roadmap Ref: §6.2 · "Yanlış şık seçilince ... açıklama görünür")*
- [x] **4.6** Bir şık seçildikten sonra `OptionButton` bileşeninin `disabled={isAnswered}` davranışını koruduğunu kod seviyesinde doğrula. *(Roadmap Ref: §6.2 · "Şık seçildikten sonra diğer butonlar disabled")*
- [x] **4.7** "Sonraki Soru" / "Testi Bitir" metin hesabını ve boş opsiyon filtrelemesini test et; state reset akışını destekleyen saf mantık doğrulandı. *(Roadmap Ref: §6.2 · "Sonraki Soru tıklandığında state sıfırlanır")*
- [x] **4.8** `npm test` komutunu çalıştır; 5 testin tamamının geçtiğini kaydet. *(Roadmap Ref: §6.2 · React Component Testleri)*

---

## 5. Manuel UI Testleri

- [x] **5.1** Uygulamaya en az 5 soru ekle; ilk, orta ve son sıradaki soruları manuel olarak test edilecek veri setine dahil et. *(Roadmap Ref: §6.2 · Manuel UI Test Kontrol Listesi)*
- [ ] **5.2** A, B, C, D ve varsa E şıklarını sırayla doğru cevap olacak şekilde test et; her doğru cevapta yalnızca doğru şıkkın yeşil olduğunu doğrula. *(Roadmap Ref: §6.2 · "Tüm şıkları A'dan E'ye sırayla doğru ... seç")*
- [ ] **5.3** A, B, C, D ve varsa E şıklarını yanlış cevap olacak şekilde test et; yanlış şık kırmızı, doğru şık yeşil ve açıklama görünür olmalı. *(Roadmap Ref: §6.2 · "Tüm şıkları A'dan E'ye sırayla ... yanlış seç")*
- [ ] **5.4** "Sonraki Soru" butonuna art arda 5 kez tıkla; her geçişte state'in sıfırlandığını ve son soruda "Testi Bitir" metninin göründüğünü doğrula. *(Roadmap Ref: §6.2 · "Sonraki Soru ardı ardına 5 kez")*
- [ ] **5.5** Chrome, Firefox ve Safari veya mevcut alternatif tarayıcılarda quiz akışını test et; RTL hizalama ve buton davranışını karşılaştır. *(Roadmap Ref: §6.2 · "Firefox, Chrome, Safari'de RTL düzeni test et")*
- [ ] **5.6** DevTools mobil simülatörde 375px genişlikte testi tekrarla; buton taşması, metin kırılması ve açıklama bloğu hizasını kontrol et. *(Roadmap Ref: §6.2 · "Mobil simülatörde (DevTools 375px) testi tekrarla")*

---

## 6. Arapça Round-trip ve Özel Karakter Testleri

- [x] **6.1** Swagger/Postman üzerinden Arapça bir soru POST et; dönen ID'yi test kayıtlarında sakla. *(Roadmap Ref: §6.3 · Senaryo A - Round-trip Testi)*
- [x] **6.2** Aynı ID ile GET isteği çalıştır; `questionText`, şıklar ve `explanation` değerlerinin POST payload'u ile bire bir aynı olduğunu doğrula. *(Roadmap Ref: §6.3 · Senaryo A - Round-trip Testi)*
- [x] **6.3** Gerekirse karakter sayısı veya JSON string karşılaştırmasıyla round-trip farkı olmadığını teknik olarak doğrula. *(Roadmap Ref: §6.3 · "Hexdump veya karakter sayısıyla karşılaştır")*
- [x] **6.4** Ta marbuta, elif maksura, hemzeli vav, hemzeli ye ve Arapça ondalık virgül içeren özel karakter test sorusu oluştur. *(Roadmap Ref: §6.3 · Senaryo B - Özel Karakter Testi)*
- [x] **6.5** Özel karakter test sorusunu POST ve GET ile round-trip doğrulamadan geçir; karakterlerin kaybolmadığını veya dönüşmediğini kontrol et. *(Roadmap Ref: §6.3 · Senaryo B - Özel Karakter Testi)*
- [x] **6.6** Hareke içeren bir soru oluştur; özellikle fatha, kasra ve damma karakterlerinin saklanıp geri döndüğünü doğrula. *(Roadmap Ref: §6.3 · Senaryo C - Hareke (Diacritic) Testi)*

---

## 7. Performans Doğrulaması

- [x] **7.1** Veritabanına yaklaşık 100 soru içeren test verisi hazırla veya mevcut veri setini 100 kayıt seviyesine çıkar. *(Roadmap Ref: §6.4 · Performans Doğrulama)*
- [x] **7.2** Browser DevTools Network tab üzerinden `GET /api/questions` süresini ölç; local ortamda hedefin `< 500ms` olduğunu not et. *(Roadmap Ref: §6.4 · Network Tab - GET /api/questions < 500ms)*
- [x] **7.3** Network tab üzerinden response size değerini kontrol et; 100 soru için beklenen boyutun yaklaşık `< 50KB` ve gzip davranışının kabul edilebilir olduğunu değerlendir. *(Roadmap Ref: §6.4 · Response size)*
- [ ] **7.4** React DevTools Profiler ile bir şık tıklamasını kaydet; beklenen yeniden render davranışını ve gereksiz geniş render olup olmadığını incele. *(Roadmap Ref: §6.4 · React DevTools - Profiler)*
- [x] **7.5** Performans ölçüm sonuçlarını tarih, tarayıcı, kayıt sayısı, response time ve gözlenen render davranışıyla birlikte kaydet. *(Roadmap Ref: §6.4 · Performans Doğrulama)*

---

## 8. Faz 6 Kapanış Doğrulaması

- [x] **8.1** T1-T8 tüm API testlerinin geçtiğini son kez kontrol et; kalan başarısız test varsa endpoint ve hata koduyla kaydet. *(Roadmap Ref: §6 · Faz 6 Doğrulama)*
- [x] **8.2** Round-trip testinin Arapça karakter bozulması olmadan geçtiğini doğrula. *(Roadmap Ref: §6 · Faz 6 Doğrulama)*
- [x] **8.3** Component testlerinin geçtiğini ve test komutu çıktısında başarısız test kalmadığını doğrula. *(Roadmap Ref: §6 · Faz 6 Doğrulama)*
- [ ] **8.4** Mobil ve masaüstü RTL düzeninin doğru olduğunu manuel test sonuçlarıyla doğrula. *(Roadmap Ref: §6 · Faz 6 Doğrulama)*
- [x] **8.5** 100 soru sonrasında API ve UI performansının kabul edilebilir olduğunu ölçüm sonuçlarıyla doğrula. *(Roadmap Ref: §6 · Faz 6 Doğrulama)*
- [x] **8.6** Faz 6 sonuçlarını kısa bir özetle dokümante et; başarısız veya ertelenmiş maddeleri ayrı listele. *(Roadmap Ref: §6 · Faz 6 Doğrulama)*

---

> ⏭️ **Bir sonraki adım:** MVP sonrası geliştirme başlıklarından öncelik seçimi — sayfalama, kategori filtresi, JWT authentication, skor takibi veya dark mode.
