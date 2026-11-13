# Design System Specification — MyWallet
**Aesthetic Direction:** Warm Organic Minimalism & Tactile Editorial  
**Reference Style:** Paper-toned surfaces, deep forest-charcoal ink, flat tonal layering, and subtle human handwritten accents.

---

## 1. Core Design Principles
1. **Tactile Warmth over Sterile White:** Hindari warna putih murni (`#FFFFFF`) dan hitam murni (`#000000`) sebagai warna dasar. Gunakan spektrum *warm alabaster* dan *deep forest charcoal* agar mata nyaman saat membaca data finansial.
2. **Tonal Layering, Zero Heavy Shadows:** Hierarki visual dibangun menggunakan perbedaan kontras permukaan (*surface contrast*) dan garis tipis (*hairline borders*), bukan *drop shadow* tebal atau efek *glow*.
3. **Humanized Fintech:** Data keuangan sering terasa kaku. Tambahkan sentuhan organik melalui tipografi campuran (*regular + bold* pada *greeting*), aksen catatan tulisan tangan (*handwritten micro-copy*), dan ilustrasi botanikal tipis di sudut layar.
4. **High-Contrast Legibility:** Semua angka nominal, persentase anggaran, dan jadwal tagihan wajib menggunakan *tabular numerals* dengan kontras tinggi.

---

## 2. Color Tokens

### Surface & Background
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F5F3EF` | Background utama seluruh halaman (Warm Alabaster). |
| `--bg-surface` | `#FAF9F6` | Card list transaksi, jadwal, dan container konten utama. |
| `--bg-surface-muted` | `#EBE8E1` | Tombol sekunder bulat (back button, icon button), track progress bar. |
| `--bg-surface-sage` | `#E2E5DC` | Highlight card aktif pada timeline/jadwal atau ringkasan catatan penting. |
| `--bg-hero-dark` | `#1F241E` | Base warna Hero Card (Total Saldo / Limit Bulanan) dengan overlay foto atmosferik gelap. |

### Ink & Typography
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--text-primary` | `#1F241E` | Heading utama, nominal saldo, judul transaksi, ikon aktif. |
| `--text-secondary` | `#6E716A` | Sub-judul, metadata (`Kategori • Jam`), label hari kalender. |
| `--text-tertiary` | `#9A9C95` | Timestamp sisi kiri timeline, placeholder, teks non-aktif. |
| `--text-on-dark` | `#F5F3EF` | Teks utama di atas Hero Card gelap atau pill tanggal aktif. |

### Accent & Semantic
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--accent-primary` | `#1F241E` | Primary CTA, Floating Action Button (`+`), active date pill, progress fill. |
| `--accent-sage` | `#5A6E58` | Indikator status aktif (`• Active` / `• On track`), dot kategori pemasukan. |
| `--accent-alert` | `#D96B52` | Dot notifikasi belum dibaca, indikator pengeluaran berlebih (*overbudget*). |
| `--border-hairline` | `rgba(31, 36, 30, 0.08)` | Garis pemisah antar baris transaksi dan outline checkbox belum selesai. |

---

## 3. Typography

### Font Families
* **Primary UI & Display:** `Plus Jakarta Sans` atau `DM Sans` (Geometric-humanist sans-serif yang bersih dan modern).
* **Handwritten Accent:** `Caveat` atau `Kalam` (Untuk catatan mikro personal seperti *"Small steps, big savings"* atau *"Good day :)"*).

### Type Scale & Rules
* **Hero Greeting:** `28px` / `1.2` line-height. Pola campuran: *"Good morning,"* (`Regular 400`, `#4A4D47`) + **"Riza"** (`Bold 700`, `#1F241E`).
* **Hero Metric (Balance / Budget):** `32px` (`Bold 700`), menggunakan `font-variant-numeric: tabular-nums`.
* **Section Header:** `18px` (`SemiBold 600`), letter-spacing `-0.01em`.
* **Card Title / Transaction Name:** `15px` (`Medium 500` atau `SemiBold 600`), `#1F241E`.
* **Metadata / Subtitle:** `12px` (`Regular 400`), `#6E716A`. Format terpisah titik tengah: `Food & Drink • 10:00 AM`.
* **Handwritten Micro-Note:** `13px` (`Regular 400`), rotasi `-4deg` hingga `-6deg`, warna `#4A4D47`, dilengkapi garis bawah atau panah lengkung SVG tipis.

---

## 4. Shape, Spacing & Layout Grid

* **Base Grid:** `8px` spacing system.
* **Screen Padding:** `20px` horizontal padding pada viewport mobile (`375px` - `430px`).
* **Border Radius:**
  * `24px` — Hero Banner Card (Saldo / Ringkasan Anggaran).
  * `18px` — Horizontal Wallet / Savings Goal Cards & Expanded Schedule Card.
  * `14px` — Standard Transaction / Schedule Row Card.
  * `12px` — Active Date Pill pada kalender horizontal.
  * `9999px` — Status badges (`• On track`), Floating Bottom Navigation Dock, dan Circular FAB (`52px x 52px`).
* **Elevation:** Hindari `box-shadow` berat. Gunakan `1px solid var(--border-hairline)` atau perbedaan tone warna antara `--bg-canvas` (`#F5F3EF`) dan `--bg-surface` (`#FAF9F6`).

---

## 5. Component Specifications (MyWallet Mapping)

### A. Top Bar & Handwritten Header
* **Home Header:**
  * Kiri atas: Catatan tulisan tangan miring + panah SVG kecil.
  * Kanan atas: Icon lonceng notifikasi (`24px` stroke `1.75px`) dengan badge dot `#D96B52` (`6px`) + Avatar profil bulat (`36px`).
* **Sub-page Header (misal: *Cashflow Schedule* / *Budget Detail*):**
  * Kiri: Tombol `<` bulat (`40px x 40px`, background `#EBE8E1`).
  * Tengah: Judul halaman (`18px SemiBold`) + sub-judul 1 baris (`12px`, `#6E716A`).
  * Kanan: Icon kalender/filter bulat (`40px x 40px`, background `#EBE8E1`).

### B. Hero Budget / Summary Card
* **Visual:** Container `border-radius: 24px`, height `~150px`, menggunakan foto lanskap alam ber-tone gelap/redup (*desaturated forest/mountain*) dengan gradient overlay `rgba(25, 30, 24, 0.72)`.
* **Konten:**
  * Label atas: `"Monthly budget"` (`12px`, `rgba(245, 243, 239, 0.75)`).
  * Angka utama: **`Rp 4.2jt`** `/ 6.0jt` (`28px Bold` untuk angka terpakai, `16px Regular` untuk total limit).
  * Bottom bar: Linear progress bar (`height: 4px`, `border-radius: 99px`, fill `#FAF9F6`, track `rgba(255,255,255,0.25)`) + link teks `"Details >"` di sisi kanan.

### C. Horizontal Wallets / Savings Goals Carousel
* **Layout:** Horizontal scroll dengan gap `12px`, lebar card `148px` (terlihat 2.3 card di layar untuk memicu affordance geser).
* **Struktur Card (`#FAF9F6`, radius `18px`, padding `10px`):**
  * Thumbnail visual atas (`height: 84px`, radius `12px`) dengan pill badge melayang di kiri atas (`background: rgba(250, 249, 246, 0.92)`, dot hijau `#5A6E58`, teks `11px Medium`: `"Active"`).
  * Nama Dompet / Target (misal: *"Emergency Fund"*, *"Japan Trip"*).
  * Kategori/Bank (`11px`, `#6E716A`).
  * Persentase (`75%`, `11px Bold`) di atas linear progress bar hitam/charcoal (`height: 3px`).

### D. Transaction & Scheduled Bills List
* **Layout:** List vertikal bersih tanpa card terpisah (dipisah garis hairline `1px solid rgba(31,36,30,0.08)`), padding vertikal `14px`.
* **Struktur Baris:**
  * **Kiri:** Lingkaran status `22px`. Jika transaksi selesai/lunas: fill `#1F241E` dengan ikon centang putih (`12px`). Jika tagihan pending: border `1.5px solid #B8B9B2` kosong.
  * **Tengah:** Nama transaksi (`14px Medium`, `#1F241E`) + sub-teks (`12px`, `#6E716A`: `"Subscription • 10:00 AM"`).
  * **Kanan:** Nominal uang atau chevron `>` (`16px`, `#6E716A`).

### E. Floating Pill Navigation & Detached FAB
* **Bottom Bar Layout:** Terdiri dari 2 elemen terpisah di bagian bawah layar (`bottom: 20px`, `left: 20px`, `right: 20px`):
  1. **Navigation Pill:** `height: 56px`, `border-radius: 9999px`, background `#FAF9F6` dengan border `1px solid rgba(31,36,30,0.08)` dan shadow sangat halus (`0 4px 20px rgba(31,36,30,0.04)`). Berisi 4 ikon (Home, Schedule/Cashflow, Wallets, Profile). Tab aktif ditandai dengan ikon solid `#1F241E` + garis indikator horizontal kecil (`16px x 2px`) tepat di bawah ikon.
  2. **Detached FAB:** Lingkaran solid `#1F241E` (`56px x 56px`) di sisi kanan bawah sejajar dengan pill navigasi, berisi ikon `+` putih (`22px`) untuk aksi cepat (*Add Transaction*).

---

## 6. Strict Anti-Patterns (Do Not Use)
* **Dilarang menggunakan warna neon, cyan/electric blue glow, atau gradient 3D mengilap.**
* **Dilarang menggunakan Dark Mode pekat (`#000000`) sebagai default theme.** Identitas visual ini bertumpu pada *warm paper light theme* dengan aksen gelap terbatas pada Hero Card dan tombol primer.
* **Dilarang memakai font dekoratif berlebihan pada angka.** Semua nominal mata uang harus mudah dipindai dalam sekilas pandang.