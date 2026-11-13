# MySchedule

Aplikasi pelacak agenda dan pengingat jadwal harian berbasis luring (offline-first). Dibangun menggunakan React Native, Expo SDK 58, TypeScript, dan basis data SQLite lokal.

## Arah Desain
Mengacu pada spesifikasi desain Warm Organic Minimalism dan Tactile Editorial:
* Spektrum warna Warm Alabaster (`#F5F3EF`), Surface (`#FAF9F6`), dan Dark Forest Charcoal (`#1F241E`).
* Hierarki visual berbasis kontras permukaan dan garis hairline, tanpa bayangan tebal.
* Tipografi terstruktur dengan dukungan angka tabular yang mudah dipindai.
* Floating Navigation Dock melayang di bagian bawah dengan Detached Action Button terpisah.

## Fitur Utama
* Penyimpanan Lokal Penuh: Seluruh data agenda tersimpan di SQLite lokal perangkat tanpa memerlukan koneksi internet.
* Ringkasan Agenda Hari Ini: Kartu ringkasan utama menampilkan rasio agenda selesai, total jadwal, dan indikator progres.
* Pemilih Tanggal Horizontal: Navigasi cepat antar hari dengan penanda titik agenda aktif.
* Pengelompokan Kategori: Klasifikasi jadwal ke dalam Pekerjaan, Pribadi, Finansial, Kesehatan, dan Belajar.
* Manajemen Status Agenda: Tandai selesai atau tertunda secara instan dengan konfirmasi haptic feedback.
* Formulir Agenda Lengkap: Pengaturan judul, tanggal, jam mulai, jam selesai, tingkat prioritas, dan alarm notifikasi.
* Modal Pengingat & Profil: Melihat daftar alarm jadwal yang aktif dan statistik rasio penyelesaian tugas.

## Spesifikasi Teknis
* Framework: React Native 0.88.1, Expo SDK 58, React 19.3.0
* Bahasa: TypeScript 6.0.3
* Basis Data: expo-sqlite (native) dengan fallback memori (web)
* Ikon: @expo/vector-icons (Ionicons)
* Haptics: expo-haptics
* Package Android: com.riza.myschedule

## Cara Menjalankan

```bash
# Menjalankan server pengembangan
npm start

# Menjalankan di platform web
npm run web

# Menjalankan di emulator atau perangkat Android
npm run android
```
