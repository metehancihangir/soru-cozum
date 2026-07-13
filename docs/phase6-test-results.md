# Faz 6 Test Sonuçları

> Güncelleme tarihi: 2026-07-13

## Otomatik Kontroller

| Kontrol | Komut | Durum | Not |
|---|---|---|---|
| Backend build | `dotnet build -o artifacts/backend-phase6` | Geçti | Varsayılan `bin` klasörü çalışan API prosesi tarafından kilitli olduğu için ayrı output klasörü kullanıldı. |
| Frontend logic tests | `npm test` | Geçti | 5 test geçti; `QuestionCard`/`OptionButton` karar mantığı Node test runner ile doğrulandı. |
| Frontend lint | `npm run lint` | Geçti | ESLint hatası kalmadı. |
| Frontend production build | `npm run build` | Geçti | Vite build başarılı; 21 modül dönüştürüldü. |
| API smoke test | `scripts/phase6-api-smoke.ps1` | Geçti | Geçici API `localhost:5250` üzerinde çalıştırıldı; T1-T8, round-trip, invalid option ve performans kontrolleri geçti. |

## API Smoke Test Kapsamı

- T1 `GET /api/questions`
- T2 geçerli Arapça payload ile `POST /api/questions`
- T3 eksik `questionText` ile `POST /api/questions`
- T4 var olan ID ile `GET /api/questions/{id}`
- T5 olmayan ID ile `GET /api/questions/{id}`
- T6 güncellenmiş veri ile `PUT /api/questions/{id}`
- T7 var olan ID ile `DELETE /api/questions/{id}`
- T8 silinmiş ID ile tekrar `DELETE /api/questions/{id}`
- Arapça round-trip: `ة ى ؤ ئ ٫ كَتَبَ`
- Geçersiz `correctOption`
- 100 kayıt hedefiyle local performans kontrolü

## Ölçüm Sonuçları

| Ölçüm | Sonuç |
|---|---|
| API CRUD matrisi | T1-T8 geçti |
| Eksik `questionText` | `400 Bad Request` |
| Geçersiz `correctOption` | `400 Bad Request` |
| Arapça round-trip | Exact match, 16 karakter |
| Performans seed | Veritabanı 100 kayda tamamlandı |
| `GET /api/questions` local süre | 204ms |
| `GET /api/questions` response size | 26,692 byte |
| `GET /api/questions` kayıt sayısı | 100 |

## Manuel Kontrol Notları

- Tarayıcılar: Chrome ve Edge bu ortamda doğrulanabilir; Firefox/Safari yerel kurulum durumuna bağlıdır.
- Mobil düzen: DevTools 375px simülasyonuyla doğrulanmalıdır.
- SQL encoding: `mysql` CLI PATH'te olmadığı için `SHOW VARIABLES LIKE 'character_set%';` ve `SHOW CREATE TABLE Questions;` çıktıları bu çalıştırmada alınamadı.
