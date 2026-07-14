# Brand spec — Soru Çözüm (Medium.com DS)

Kaynak: kullanıcının sağladığı Medium.com tasarım sistemi.

## Renk tokenları

| Token | Hex / değer | Rol |
|---|---|---|
| `--bg` | `#ffffff` | Birincil arka plan |
| `--surface` | `rgba(0,0,0,0.05)` | Kart yüzeyleri |
| `--fg` | `rgba(0,0,0,0.8)` | Birincil metin |
| `--muted` | `#6b6b6b` | İkincil metin, etiketler |
| `--border` | `#e6e6e6` (türetilmiş) | Kenarlıklar |
| `--ink` | `#242424` | Başlıklar, koyu nötr |
| `--cta` | `#191919` | CTA pill, beyaz metin |
| `--accent` | `#1a8917` | Yalnızca başarı |
| `--correct-bg` | `#dcfce7` | Doğru cevap arka plan |
| `--correct-border` | `#1a8917` | Doğru cevap kenarlık |
| `--wrong-bg` | `#fee2e2` | Yanlış cevap arka plan |
| `--wrong-border` | `#ef4444` | Yanlış cevap kenarlık |

OKLch eşdeğerleri (yaklaşık):

```css
:root {
  --bg:      oklch(100% 0 0);
  --surface: oklch(0% 0 0 / 0.05);
  --fg:      oklch(0% 0 0 / 0.8);
  --muted:   oklch(52% 0 0);
  --border:  oklch(92% 0 0);
  --ink:     oklch(22% 0 0);
  --cta:     oklch(15% 0 0);
  --accent:  oklch(52% 0.14 145);
}
```

## Tipografi

- Display / Arapça soru: `'GT Super', Georgia, serif`
- UI / arayüz: `'Sohne', Inter, system-ui, sans-serif`
- Weight: her yerde **400** (bold yok)
- Boyutlar: başlık 28–32px · alt başlık 22px · gövde 14px · küçük 13px
- Satır yüksekliği: gövde 1.43 · başlık 1.27

## Şekil dili

- Butonlar: `border-radius: 9999px` (pill)
- Kartlar: `4px` veya 0
- Badge: `2px`
- Gölge: minimal, yalnızca modal/toast için çok hafif diffuse
- Animasyon: yok veya 0.15s ease

## Postür

1. Minimal, içerik ön planda — dekorasyon yok
2. Mobil öncelikli: max-width 640px, padding 16–24px
3. Arapça: `direction: rtl; text-align: right;` + serif
4. Türkçe arayüz metni
5. Vurgu yeşili yalnızca başarı durumlarında
