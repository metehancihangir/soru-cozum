# Medium.com — Tasarım Sistemi

> Dembrandt aracı ile `https://medium.com` adresinden çekilen gerçek DOM değerleri.  
> Çekim tarihi: 2026-07-14 · Kaynak: headless Chromium + computed CSS analizi

---

## İçindekiler

1. [Renk Paleti](#1-renk-paleti)
2. [Tipografi](#2-tipografi)
3. [Boşluk Sistemi](#3-boşluk-sistemi)
4. [Sınır Yarıçapı (Border Radius)](#4-sınır-yarıçapı)
5. [Gölgeler](#5-gölgeler)
6. [Bileşenler](#6-bileşenler)
7. [Hareket & Animasyon](#7-hareket--animasyon)
8. [CSS Değişkenleri](#8-css-değişkenleri)
9. [Font Kaynakları](#9-font-kaynakları)
10. [Tasarım Notları](#10-tasarım-notları)

---

## 1. Renk Paleti

### Semantik Renkler

| Rol | Değer | Hex |
|-----|-------|-----|
| **Birincil (Primary)** | `rgb(25, 25, 25)` | `#191919` |
| **Arka Plan (Background)** | `rgb(255, 255, 255)` | `#ffffff` |
| **Metin (Text)** | `rgba(0, 0, 0, 0.8)` | — |

### Tam Palet

| Renk | Hex | Güven | Kullanım Sayısı | Rol | Üstündeki Renk |
|------|-----|-------|-----------------|-----|----------------|
| ⬛ Koyu Gri | `#242424` | **Yüksek** | 26 | `neutral` | `#ffffff` (beyaz) |
| ⬜ Orta Gri | `#6b6b6b` | **Yüksek** | 22 | `neutral` | `#ffffff` (beyaz) |
| ⬜ Beyaz | `#ffffff` | **Yüksek** | 3 | `surface` | `#000000` (siyah) |
| ⬛ Siyah | `#000000` | **Yüksek** | 10 | — | — |
| ⬛ Derin Siyah | `#101010` | **Orta** | 1 | hover/focus | — |

> **Özet:** Medium son derece minimal bir palet kullanır — siyah, beyaz ve gri tonları. Renk konusunda kasıtlı olarak kısıtlıdır; marka kimliği renk yerine tipografiye dayanır.

### Hover Tonları (Algoritmik)

| Renk | Normal | Hover Tonu |
|------|--------|-----------|
| Koyu Gri | `#242424` | `#2b2b2b` |
| Orta Gri | `#6b6b6b` | `#808080` |
| Beyaz | `#ffffff` | `#d9d9d9` |

---

## 2. Tipografi

### Font Aileleri

| Tip | Aile | Fallback'ler |
|-----|------|-------------|
| **Başlık / Display** | `gt-super` (serif) | Georgia, Cambria, Times New Roman, Times |
| **Arayüz / Body** | `sohne` (sans-serif) | Helvetica Neue, Helvetica, Arial |
| **Sistem Fallback** | `medium-content-sans-serif-font` | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue |

### Tipografi Ölçeği

| Bağlam | Aile | Boyut | Ağırlık | Satır Yüksekliği | Harf Aralığı |
|--------|------|-------|---------|-----------------|-------------|
| **heading-2** (Display) | `gt-super` | `120px / 7.5rem` | 400 | 0.83 | −6.6px |
| **heading-3** | `sohne` | `22px / 1.38rem` | 400 | 1.27 | — |
| **ui** (büyük) | `sohne` | `20px / 1.25rem` | 400 | 1.40 | — |
| **link / text** | `medium-content-sans-serif-font` | `16px / 1.00rem` | 400 | — | — |
| **body** (varsayılan) | `sohne` | `14px / 0.88rem` | 400 | 1.43 | — |
| **ui** (küçük) | `sohne` | `14px / 0.88rem` | 400 | 1.43 | — |
| **link** (küçük) | `sohne` | `14px / 0.88rem` | 400 | 1.43 | — |
| **body** (xs) | `sohne` | `13px / 0.81rem` | 400 | 1.54 | — |
| **link** (xs) | `sohne` | `13px / 0.81rem` | 400 | 1.54 | — |

### OpenType Özellikleri

```
"lnum"  → Düz sayı rakamları (lining numerals)
"pnum"  → Orantılı rakam genişliği (proportional numerals)
```

> **Not:** Bu özellikler heading-2 (GT Super) üzerinde aktif. Sayıların yayın başlıklarında daha profesyonel görünmesini sağlar.

---

## 3. Boşluk Sistemi

**Izgara Türü:** `8px` tabanlı

| Token | px | rem | Kullanım |
|-------|----|-----|---------|
| `space-1` | 8px | 0.50rem | 6× (temel birim) |
| `space-2` | 10px | 0.63rem | 2× |
| `space-3` | 24px | 1.50rem | 2× |
| `space-4` | 25px | 1.56rem | 2× |
| `space-5` | 48px | 3.00rem | 2× |
| `space-6` | 75px | 4.69rem | 1× |

> **Özet:** 8px tabanlı ızgara sistemi. Temel birim 8px, büyük boşluklar 24px ve 48px katları ile ilerler.

---

## 4. Sınır Yarıçapı

| Değer | Eleman | Güven | Not |
|-------|--------|-------|-----|
| `2px` | badge | Düşük | Neredeyse keskin köşe |
| `1386px` | button | Düşük | Tam yuvarlak (pill) |
| `1980px` | button | Düşük | Tam yuvarlak (pill) |

> **Özet:** Medium, butonlarda yüksek sayısal değerler kullanarak "pill" (tam oval) şekil elde eder. Bu, CSS'te `border-radius: 9999px` ile eşdeğerdir.

---

## 5. Gölgeler

| Gölge | Kullanım | Güven |
|-------|---------|-------|
| `rgb(128, 128, 128) 0px 0px 5px 0px` | 1× | Düşük |

> **Not:** Medium minimal gölge kullanır — sadece 1 hafif gri yayılma gölgesi tespit edildi. Derinlik, renk ve gölge yerine whitespace ile sağlanır.

---

## 6. Bileşenler

### Butonlar

#### "Get started" (Küçük Buton)

```css
background-color: rgb(25, 25, 25);   /* #191919 — neredeyse siyah */
color:            rgb(255, 255, 255); /* beyaz metin */
padding:          8px 16px;
border-radius:    1386px;             /* tam oval / pill */
border:           1px solid rgb(25, 25, 25);
font-size:        14px;
font-weight:      400;
```

#### "Start reading" (Büyük CTA Butonu)

```css
background-color: rgb(25, 25, 25);   /* #191919 */
color:            rgb(255, 255, 255);
padding:          8px 20px;
border-radius:    1980px;             /* tam oval / pill */
border:           1px solid rgb(25, 25, 25);
font-size:        20px;
font-weight:      400;
```

**Hover durumu:**
```css
/* "Start reading" hover */
background-color: rgb(0, 0, 0);      /* saf siyaha geçiş */
```

### Bağlantılar (Links)

| Durum | Renk | Alt Çizgi |
|-------|------|-----------|
| Varsayılan | `rgba(0, 0, 0, 0.8)` | Yok |
| Hover | `var(--color-fg-neutral-primary)` | Yok |

```css
/* Link varsayılan */
color:           rgba(0, 0, 0, 0.8);
text-decoration: none;
font-weight:     400;

/* Alternatif link rengi */
color:           rgb(36, 36, 36);  /* #242424 */
```

---

## 7. Hareket & Animasyon

### Geçiş Süreleri

| Değer | ms | Kullanım Sayısı |
|-------|----|-----------------|
| `0.001s` | 1ms | 100× (tüm interaktif elementler) |

> **Not:** 0.001s çok kısa bir değer — bu, Medium'un animasyonu pratikte devre dışı bıraktığı anlamına gelir. Geçişler anlık gerçekleşir.

### Easing Fonksiyonları

| Fonksiyon | Kullanım |
|-----------|---------|
| `ease` | 98× (linkler) |
| `linear` | 3× (butonlar — background-color, color) |

### İnteraktif Davranışlar

| Element | Olay | Değişen Özellik | Başlangıç | Bitiş |
|---------|------|-----------------|-----------|-------|
| Logo bağlantısı | hover | `color` | `rgba(0,0,0,0.8)` | `rgb(36,36,36)` |
| "Get started" | hover | `color` | `rgba(0,0,0,0.8)` | `rgb(36,36,36)` |
| "Start reading" | hover | `background` | `rgb(25,25,25)` | `rgb(0,0,0)` |

---

## 8. CSS Değişkenleri

Medium, renk sistemini CSS custom properties ile yönetir:

| Değişken | Değer | LCH | OKLCH |
|----------|-------|-----|-------|
| `--color-bg-accent-secondary` | `#bbdbba` | `lch(84.37% 21.05 142.74)` | `oklch(85.91% 0.056 144.27)` |
| `--color-fg-accent-primary` | `#1a8917` | `lch(49.7% 69.89 136.81)` | `oklch(54.98% 0.174 142.51)` |
| `--color-bg-accent-tertiary` | `#d2e7d1` | `lch(89.61% 13.78 142.69)` | `oklch(90.64% 0.037 144.01)` |

> **İlginç Bulgu:** Yeşil vurgu rengi (`#1a8917`) Medium'un marka yeşilidir — yazı başarı bildirimleri, klapaj (applause) butonu ve vurgu elementlerde kullanılır. Ana akış renginden farklı olarak sıklıkla tespit edilmedi.

---

## 9. Font Kaynakları

| Kaynak | Ayrıntı |
|--------|---------|
| **Self-hosted fontlar** | `gt-super-400-normal.woff`, `sohne-400-normal.woff` |
| **Google Fonts** | Kullanılmıyor |
| **Adobe Fonts** | Kullanılmıyor |
| **Variable Font** | Kullanılmıyor |
| **OpenType özellikleri** | `lnum`, `pnum` |

---

## 10. Tasarım Notları

### Genel Tasarım Felsefesi
Medium'un tasarım sistemi **içerik öncelikli minimalizm** üzerine kuruludur:

- **Renkten kaçınma:** Yalnızca siyah, beyaz ve gri. Renk sadece vurgu için (yeşil accent) ve çok sınırlı kullanımda.
- **Tipografi = Kimlik:** Özel fontlar (GT Super serif + Sohne sans-serif) ile marka kimliği oluşturulur. Tasarım sistemi tipografi üzerine inşaadır.
- **Pill butonlar:** `border-radius: 9999px` eşdeğeri değerler — her buton tam oval.
- **Whitespace ile hiyerarşi:** Gölge ve derinlik minimal; boşluk ve tipografi ölçeği ile hiyerarşi oluşturulur.
- **Anlık geçişler:** `transition: 0.001s` — animasyona yatırım yapılmaz, etkileşim anında gerçekleşir.

### CSS Framework
Herhangi bir CSS framework (Tailwind, MUI, shadcn vb.) **tespit edilmedi** — Medium özel (custom) CSS sistemi kullanır.

### İkon Sistemi
Herhangi bir standart ikon kütüphanesi **tespit edilmedi** — özel SVG ikonlar kullanılıyor.

### Responsive
Medya sorgusu breakpoint'leri extraction sırasında **tespit edilmedi** — Medium'un responsive sistemi JS tabanlı veya SSR render sırasında aktif değildi.

---

*Bu dosya `dembrandt` CLI aracı ile otomatik olarak çekilmiş ve düzenlenmiştir.*  
*Komut: `npx -y dembrandt https://medium.com --json-only --slow`*
