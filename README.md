# MySchedule

Aplikasi manajemen agenda harian luring (offline-first) dengan widget interaktif Android. Dibuat menggunakan React Native (Expo SDK 58), TypeScript, dan SQLite lokal.

<p align="center">
  <img src="./assets/icon.png" width="120" height="120" alt="Logo MySchedule" style="border-radius: 24px;" />
</p>

## Fitur

* **Penyimpanan Lokal (SQLite):** Semua data agenda dan kategori tersimpan langsung di perangkat tanpa server luar.
* **Pengingat Jadwal:** Alarm otomatis saat jam mulai dan jam selesai agenda tiba, dilengkapi suara lonceng dan banner in-app.
* **Manajemen Kategori:** Tambah, edit warna atau ikon, serta hapus kategori dengan pengalihan tugas otomatis.
* **Penyaring Tanggal & Status:** Navigasi cepat antar hari melalui date strip horizontal dan filter status (Semua, Tertunda, Selesai).
* **Profil & Statistik:** Menampilkan tingkat penyelesaian tugas dan pengaturan nama pengguna.

## Arah Desain

Aplikasi menggunakan palet warna Warm Organic Minimalism:
* Latar: `#F5F3EF` (Alabaster) dan `#FAF9F6` (Surface)
* Kontras & Kartu Gelap: `#1F241E` (Dark Forest)
* Aksen: `#5A6E58` (Sage Green) dan `#D4973B` (Warm Ochre)
* Navigasi: Floating bottom dock dengan tombol tambah terpisah

## Struktur Proyek

```
MySchedule/
├── assets/                  # Logo aplikasi, splash screen, dan preview widget
├── src/
│   ├── components/          # Komponen antarmuka (TopBar, HeroCard, Modal, dll.)
│   ├── db/                  # Pengelolaan SQLite (native) dan fallback (web)
│   ├── theme/               # Token desain (warna, tipografi, jarak)
│   ├── types/               # Definisi tipe data TypeScript
│   ├── utils/               # Logika notifikasi alarm dan haptics
│   └── widgets/             # Komponen dan background task widget Android
├── App.tsx                  # Komponen utama aplikasi
├── app.json                 # Konfigurasi Expo dan plugin widget
├── eas.json                 # Konfigurasi build APK Android
└── index.ts                 # Titik masuk aplikasi dan pendaftaran task widget
```

## Menjalankan Proyek Secara Lokal

Pastikan Node.js dan npm sudah terpasang di komputer Anda.

```bash
# Pasang dependensi
npm install

# Jalankan server pengembangan
npm start

# Buka versi web
npm run web
```

Untuk membuka di ponsel lewat jaringan lokal atau Tailscale:
```bash
npx expo start --host lan
```

## Membangun File APK (Android)

Build APK mandiri menggunakan Expo Application Services (EAS):

```bash
# Login ke akun Expo
npx eas-cli login

# Jalankan build APK profil preview
npx eas-cli build -p android --profile preview
```

File instalasi `.apk` akan dibuat di cloud Expo dan siap diunduh ke ponsel Android.
