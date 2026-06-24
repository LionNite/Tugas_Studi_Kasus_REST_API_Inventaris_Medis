# Medical Inventory API

REST API untuk Manajemen Inventaris Medis Rumah Sakit.

## Fitur

- JWT authentication
- Role-based access control: `Super Admin`, `Apoteker`, `Dokter`
- Validasi input dengan `express-validator`
- Rate limiting `100 requests / 15 minutes`
- MySQL connection pool dengan `mysql2`

## Instalasi

1. Salin `.env.example` menjadi `.env`.
2. Isi kredensial database dan `JWT_SECRET`.
3. Jalankan:

```bash
npm install
npm run dev
```

## Endpoint utama

- `POST /api/auth/login`
- `GET /api/medicines`
- `GET /api/medicines/:id`
- `POST /api/medicines`
- `POST /api/medicines/bulk`
- `PUT /api/medicines/:id`
- `DELETE /api/medicines/:id`

## Catatan

- Semua query menggunakan parameterized query `?` untuk mencegah SQL injection.
- `express.json({ limit: '10kb' })` mencegah payload terlalu besar.
- JWT diverifikasi dengan algoritma `HS256` secara eksplisit.
