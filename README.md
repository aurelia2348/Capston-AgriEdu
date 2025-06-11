# App Starter Project with Webpack

Proyek ini adalah setup dasar untuk aplikasi web yang menggunakan webpack untuk proses bundling, Babel untuk transpile JavaScript, serta mendukung proses build dan serving aplikasi.

## Table of Contents

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (disarankan versi 12 atau lebih tinggi)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Download starter project [di sini](https://raw.githubusercontent.com/dicodingacademy/a219-web-intermediate-labs/099-shared-files/starter-project-with-webpack.zip).
2. Lakukan unzip file.
3. Pasang seluruh dependencies dengan perintah berikut.
   ```shell
   npm install
   ```

## Scripts

- Build for Production:
  ```shell
  npm run build
  ```
  Script ini menjalankan webpack dalam mode production menggunakan konfigurasi `webpack.prod.js` dan menghasilkan sejumlah file build ke direktori `dist`.

- Start Development Server:
  ```shell
  npm run start-dev
  ```
  Script ini menjalankan server pengembangan webpack dengan fitur live reload dan mode development sesuai konfigurasi di`webpack.dev.js`.

- Serve:
  ```shell
  npm run serve
  ```
  Script ini menggunakan [`http-server`](https://www.npmjs.com/package/http-server) untuk menyajikan konten dari direktori `dist`.

## Project Structure

Proyek starter ini dirancang agar kode tetap modular dan terorganisir.

```text
starter-project/
├── dist/                   # Compiled files for production
├── src/                    # Source project files
│   ├── public/             # Public files
│   ├── scripts/            # Source JavaScript files
│   │   └── index.js        # Main JavaScript entry file
│   ├── styles/             # Source CSS files
│   │   └── styles.css      # Main CSS file
│   └── index.html/         # Main HTML file
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Project metadata and dependencies
├── README.md               # Project documentation
├── STUDENT.txt             # Student information
├── webpack.common.js       # Webpack common configuration
├── webpack.dev.js          # Webpack development configuration
└── webpack.prod.js         # Webpack production configuration
```

# alur pemakaian aplikasi
## Registrasi & Onboarding
1. Pengguna membuka aplikasi
2. Tampilan Landing Page muncul (info singkat tentang AgriEdu)
3. Pengguna memilih "Daftar" atau "Masuk"
>	Jika "Daftar":
•	 Input: Username, Email, Password, Konfirmasi Password
•	 Sistem cek validasi, jika valid, lanjut
>	Halaman Onboarding:
•	Input: Nama, Lokasi, Level Pengalaman, Minat Bertani
•	Klik "Simpan"
>	Sistem arahkan ke Home (halaman utama)
>	Jika “Masuk”
>	Pengguna klik tombol “Masuk”.
•	Halaman Login tampil:
•	Input Email.
•	Input Password.
•	Tombol “Lupa Password” (opsional).
>	Sistem mengecek kredensial:
•	Jika salah akan muncul pesan error.
•	Jika benar akan lanjut ke Home
>	Jika profil belum lengkap (misalnya onboarding belum diisi):
•	Sistem akan mengarahkan ke halaman onboarding untuk isi Nama, Lokasi, Level, Minat.
>	Jika profil sudah lengkap:
•	Langsung masuk ke Halaman Utama/Home

## Menu Navigasi Utama:
> Profil
>	Pembelajaran (ke Pusat Pembelajaran Digital)
>	Komunitas (ke Forum Diskusi)
>	Diagnosa Tanaman
>	Chatbot AI Assistant

##Pusat Pembelajaran Digital
1.	Pengguna masuk ke menu "Belajar"
2.	Sistem menampilkan filter
>	Berdasarkan Level (Pemula - Lanjutan)
>	Berdasarkan Jenis Tanaman (Sayur, Buah, Hias)
>	Berdasarkan Metode (Konvensional, Organik, Hidroponik)
3.	Pengguna memilih materi
>	Sistem tampilkan konten: Artikel + Gambar / Video / Infografis
>	Sistem catat materi yang sudah dibaca
4.	Pengguna bisa Menyimpan materi sebagai favorit dan melihat progres belajar di dashboard

## Diagnosa Tanaman
1.	Pengguna masuk ke menu "Diagnosa"
>	Pilih metode upload
•	Langsung Kamera
•	Ambil dari Galeri
2.	Unggah foto tanaman bermasalah
>	Loading "Sedang Menganalisis..."  
>	Hasil Deteksi:
•	Nama Tanaman
•	Kondisi Tanaman (Sehat/Tidak Sehat)
•	Kemungkinan Penyakit
•	Rekomendasi Perawatan
•	Link Artikel Terkait
>	Pengguna bisa menyimpan hasil atau Bagikan ke Komunitas

## Komunitas Pengetahuan
1.	Pengguna buka menu "Komunitas"
>	Tampilan forum:
•	Daftar topik diskusi populer dan terbaru
•	Filter berdasarkan kategori (Buah, Sayur, Urban Farming, dll)
>	Pengguna bisa
•	Membaca dan membalas thread
•	Memberi upvote (jika fitur ini diaktifkan)
•	Membuat topik diskusi baru
•	Cari thread via keyword
•	Buat postingan berbagi pengalaman (Judul, Deskripsi, Foto, Tag)
>	Sistem dapat menampilkan notifikasi harian:
•	"Sudahkah anda berkebun hari ini? 🌱"

## Chatbot dan AI Assistant
1.	Chatbot bisa diakses dari icon chatbot (selalu tampil di semua halaman)
2.	Jendela Chat terbuka + quick reply ditampilkan
>	Pengguna bisa:
•	Ketik pertanyaan pertanian
•	Chatbot jawab otomatis
•	Jika butuh diagnosa : chatbot arahkan ke fitur diagnosa
•	Jika butuh edukasi chatbot akan merekomendasikan artikel
•	Bisa unggah foto langsung diidentifikasi oleh AI
•	Chatbot memberi link untuk info tambahan
