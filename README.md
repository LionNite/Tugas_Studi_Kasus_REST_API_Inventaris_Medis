# 🛡️ Medical Inventory REST API: Prompt Engineering & Security Case Study
| Keterangan | Detail |
| :--- | :--- |
| **Nama** | Erastus Liubeta Septian |
| **NIM** | 103072400020 |
| **Kelas** | IF-04-01 |
| **Program Studi** | Informatika |
| **Universitas** | Telkom University Surabaya |

Repositori ini berisi artefak perangkat lunak (REST API Backend) untuk sistem Inventaris Medis Rumah Sakit. Proyek ini bukanlah sekadar aplikasi CRUD biasa, melainkan sebuah **studi kasus eksplorasi Keamanan AI dan Prompt Engineering**.

Tujuan utama repositori ini adalah membuktikan bagaimana pergeseran paradigma dari instruksi kasual (*Pure Vibe Coding*) menuju instruksi terstruktur (*Promptware / Structured Chain-of-Thought*) dapat secara drastis memitigasi kerentanan keamanan bawaan (OWASP Top 10) pada kode yang dihasilkan oleh Model Bahasa Besar (LLM).

## 📝 Catatan Penulis (Methodology & Transparency)
* **Code Generation:** Saya tidak menulis keseluruhan kode di dalam repositori ini secara manual dari nol. Kode REST API di-generate menggunakan model AI (Gemini Pro). Peran saya di sini adalah sebagai **System Architect & Prompt Engineer**, di mana saya menyusun kerangka *Task-Context-Constraint* (TCC) dan *Structured Chain-of-Thought* (SCoT) untuk memaksa AI menghasilkan kode tingkat *enterprise* yang aman.
* **Penetration Testing:** Analisis keamanan dan laporan *Penetration Testing* (Pen-Test) yang terdapat di dalam dokumentasi proyek ini merupakan hasil kolaborasi dan olah data analitik menggunakan AI, berdasarkan skenario serangan yang saya tetapkan (Injeksi, BOLA/IDOR, dan DoS).

## 📂 Struktur Repositori
Repositori ini memuat dua versi *backend* yang di-generate dengan pendekatan *prompt* yang berbeda:

1. **`/Prompt_Tradisional`**: Hasil *generate* kode menggunakan *Pure Vibe Coding* (instruksi natural tanpa pagar pengaman).
2. **`/Prompt_Terstruktur`**: Hasil *generate* kode menggunakan arsitektur SCoT dan *Enterprise Security Gates*.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (dengan `mysql2` Connection Pool)
* **Keamanan:** `express-validator`, `express-rate-limit`, `bcryptjs`, JWT
* **Arsitektur:** RESTful API (JSON murni)

## 🚨 Hasil Penetration Testing (Summary)
Kami melakukan *Penetration Testing* terhadap kedua versi kode dengan skenario eksploitasi agresif. Berikut adalah ringkasan perbandingannya:

| Skenario Serangan | Hasil: Prompt Tradisional | Hasil: Prompt Terstruktur (SCoT) |
| :--- | :--- | :--- |
| **Injeksi (SQLi & XSS)** | ❌ **Rentan (Jebol).** Ketiadaan sanitasi memungkinkan *Stored XSS* tersimpan di database. | ✅ **Aman.** Mitigasi berlapis via `express-validator` dan *Parameterized Queries* murni. |
| **Broken Auth (Brute Force)** | ❌ **Rentan (Jebol).** Tidak ada batas *request*, server bisa di-spam hingga *crash*. | ✅ **Aman.** Serangan diblokir pada request ke-101 berkat implementasi Rate Limiting. |
| **BOLA / IDOR** | ❌ **Rentan (Jebol).** Peretas bisa menghapus stok obat tanpa validasi kepemilikan. | ✅ **Aman.** API memaksa eksekusi `SELECT` di sisi server sebelum menyetujui rute `DELETE`. |
| **Hardcoded Credentials** | ❌ **Fatal.** AI meninggalkan rute *fallback* ke `root` dan menaruh *password* di `init.sql`. | ⚠️ **Aman dengan Catatan.** Variabel `.env` sukses digunakan, namun AI masih memiliki *bias/drift* menyisipkan *fallback* `root` (Bukti nyata keras kepalanya model AI). |
