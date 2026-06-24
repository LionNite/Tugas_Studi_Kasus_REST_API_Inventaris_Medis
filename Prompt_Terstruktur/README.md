# Prompt Prompt Terstruktur (Arsitektur TCC & SCoT) yang dijalankan

[TASK]
Membangun REST API Backend menggunakan Node.js dan Express untuk modul "Manajemen Inventaris Medis" (Stok Obat dan Alat Kesehatan) di Rumah Sakit.

[CONTEXT]
- Tech Stack: Node.js, Express.js, MySQL (gunakan library 'mysql2' dengan connection pool), dan JavaScript ES6.
- Arsitektur: RESTful API, format JSON murni.
- Manajemen Sesi: JWT untuk autentikasi stateless.
- Otorisasi (RBAC): Super Admin (CRUD), Apoteker (CRUD), Dokter (Read-Only).

[STRUCTURED CHAIN-OF-THOUGHT (SCoT) LOGIC FLOW]
Sebelum mengeksekusi kode program, Anda WAJIB memetakan logika penalaran berurutan berikut sebagai komentar:
1. SEQUENCE: Periksa header 'Authorization' skema 'Bearer'. Tolak jika absen. Ekstrak payload dan verifikasi.
2. BRANCHING: 
   - JIKA request POST/PUT/DELETE: Izinkan 'Super Admin'/'Apoteker'. Tolak 'Dokter' (403).
   - JIKA request GET: Izinkan semua role.
3. LOOP (Bulk Input): Iterasi verifikasi pada setiap elemen sebelum memproses query MySQL.

[CONSTRAINTS - ENTERPRISE SECURITY GATES]
Anda WAJIB mematuhi aturan berikut:
1. Anti-Injeksi SQL/XSS: DILARANG pakai konkatenasi string. WAJIB pakai MySQL Parameterized Queries ('?'). Gunakan 'express-validator'.
2. Anti-BOLA/IDOR: Kunci rute eksplisit. Wajib query SELECT dulu untuk validasi ID sebelum PUT/DELETE.
3. Anti-Hardcoded: Wajib pakai 'process.env' (dotenv) untuk kredensial database & JWT.
4. Anti-DoS: Batasi payload parsing `app.use(express.json({ limit: '10kb' }));`.
5. JWT Algo Confusion: Kunci algoritma statis `jwt.verify(token, secret, { algorithms: ['HS256'] })`.
6. Rate Limiting: Implementasi 'express-rate-limit' (max 100 req/15 menit).
