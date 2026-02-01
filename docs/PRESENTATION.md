# Materi Presentasi: E-Recycle Platform

Berikut adalah poin-poin materi untuk presentasi proyek E-Recycle, yang mencakup Latar Belakang, Tujuan Aplikasi, dan Batasan Masalah.

## 1. Latar Belakang (Background)

*   **Masalah Sampah:** Meningkatnya volume sampah, terutama plastik, yang tidak terkelola dengan baik di lingkungan sekitar.
*   **Kurangnya Insentif:** Masyarakat seringkali enggan memilah sampah karena merasa "repot" dan tidak mendapatkan keuntungan langsung (insentif).
*   **Digitalisasi:** Kebutuhan akan sistem yang mempermudah proses penyetoran sampah secara transparan dan tercatat secara digital.
*   **Konsep Ekonomi Sirkular:** RecycleVibes hadir sebagai jembatan untuk mendukung ekonomi sirkular, di mana sampah diubah menjadi 'mata uang' (poin) yang bernilai, dapat ditukrkan ke produk dari mitra yang bekerja sama.

## 2. Tujuan Aplikasi (Purpose)

*   **Integrasi IoT (Rencana Utama):**
    *   Tujuan utama pengembangan aplikasi ini adalah sebagai **antarmuka (interface)** pembacaan data dari **Mesin Smart Drop Box** (Hardware IoT).
    *   Aplikasi dirancang untuk menerima data berat dan jenis sampah secara otomatis dari sensor mesin saat pengguna melakukan scan barcode/QR.

*   **Adaptasi Teknis (Kondisi Saat Ini):**
    *   Dikarenakan **keterbatasan ketersediaan perangkat keras (mesin)** saat ini, fungsi pemindaian IoT disimulasikan menggunakan **Smartphone**.
    *   Kamera HP digunakan sebagai pengganti sensor mesin untuk memindai barcode produk sampah.
    *   Algoritma di backend menghitung konversi berat ke poin secara otomatis, mensimulasikan logika yang seharusnya terjadi di mesin fisik.

*   **Gamifikasi & Edukasi:**
    *   Meningkatkan partisipasi pengguna melalui sistem **Gamifikasi** (XP, Level, Leaderboard).
    *   Mengedukasi pengguna tentang nilai ekonomi dari sampah yang mereka hasilkan.

## 3. Batasan Masalah (Limitations/Scope)

*   **Metode Input Data:**
    *   Saat ini sistem hanya menggunakan **kamera smartphone** untuk simulasi scan barcode, belum terhubung ke sensor berat (load cell) fisik secara real-time.
    *   Berat sampah ditentukan berdasarkan database produk yang sudah terdaftar (estimasi), bukan penimbangan aktual.

*   **Lingkup Produk:**
    *   Sistem hanya mengenali produk sampah yang **barcodenya sudah terdaftar** di dalam database admin. Sampah curah tanpa barcode belum bisa diproses secara otomatis.

*   **Wilayah Operasional:**
    *   Fitur penukaran (Redeem) dan lokasi drop point saat ini masih bersifat simulasi (menggunakan geolokasi pengguna untuk validasi, namun belum terikat pada logistik kurir nyata).

*   **Platform:**
    *   Aplikasi berbasis **Web (Progressive Web App - mobile first)**, bukan aplikasi native Android/iOS, namun dioptimalkan untuk tampilan mobile layaknya aplikasi native.

## 4. Teknologi yang Digunakan (Tech Stack)

*   **Frontend & Framework:**
    *   **Next.js 14:** Framework React untuk performa tinggi dan rendering yang optimal (Server Side Rendering).
    *   **Tailwind CSS:** Untuk styling antarmuka yang cepat, responsif, dan modern.
    *   **Material UI (MUI):** Komponen UI siap pakai untuk elemen interaktif.

*   **Backend & Database:**
    *   **Node.js:** Runtime environment untuk logika server.
    *   **MongoDB:** Database NoSQL untuk menyimpan data user, transaksi, dan log aktivitas secara fleksibel.
    *   **NextAuth.js:** Sistem autentikasi aman untuk login pengguna.

*   **Tools Pengembangan (Development Tools):**
    *   **Visual Studio Code:** Code editor utama.
    *   **Google Antigravity (AI Agent):** Asisten AI canggih yang digunakan sebagai *Pair Programmer* untuk mempercepat proses coding, debugging, dan refactoring layout.

## 5. Tips Desain Slide (Untuk Proyektor)

Agar tulisan terbaca jelas oleh penguji dari jarak jauh:

*   **Judul Slide:** Ukuran **36pt - 44pt** (Bold).
*   **Isi/Deskripsi:** Ukuran **24pt - 32pt**.
    *   *Jangan gunakan di bawah 24pt karena akan sulit terbaca.*
*   **Kontras:** Gunakan teks gelap di background terang (atau sebaliknya).
*   **Poin-poin:** Hindari paragraf panjang, gunakan poin-poin singkat (seperti di dokumen ini).

## 6. FAQ / Antisipasi Pertanyaan Penguji

**Q: Kenapa pakai sistem POIN? Kenapa tidak langsung ditransfer UANG (Rupiah/E-Wallet) saja?**

*   **Masalah Transaksi Mikro (Micropayments):**
    *   Harga 1 botol plastik mungkin hanya Rp 50 - Rp 100 perak.
    *   Jika ditransfer langsung ke E-Wallet (Gopay/OVO), biaya admin transfernya (Rp 1.000 - Rp 2.500) jauh lebih mahal daripada nilai sampah yang disetor. Sistem jadi rugi.
    *   Dengan Poin, kita bisa menampung nilai sekecil apapun tanpa biaya admin.

*   **Psikologi Pengguna (Gamifikasi):**
    *   Mendapat **"100 Poin"** terdengar lebih banyak dan memuaskan daripada mendapat **"Rp 100"**.
    *   Poin memungkinkan adanya Leveling (XP) dan Leaderboard yang membuat user ingin terus aktif (sifatnya adiktif positif).

*   **Ekosistem & Kemitraan:**
    *   Poin bisa mengarahkan user untuk menukar ke produk spesifik atau voucher mitra. Ini membuka peluang bisnis B2B (iklan produk mitra).
    *   Kalau uang tunai, user bisa pakai untuk apa saja di luar ekosistem aplikasi, sehingga retensi user ke aplikasi jadi rendah.
