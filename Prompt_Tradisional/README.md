# Medical Inventory REST API

REST API sederhana untuk manajemen inventaris medis di rumah sakit.

## Fitur
- Login JWT (`/api/auth/login`)
- Lihat data obat (`GET /api/medicines`)
- Tambah obat secara masal (`POST /api/medicines/bulk`)
- Hapus obat (`DELETE /api/medicines/:id`)
- Role: `Super Admin`, `Apoteker`, `Dokter`

## Setup
1. Salin `.env.example` menjadi `.env`.
2. Sesuaikan kredensial MySQL dan `JWT_SECRET`.
3. Import `init.sql` ke MySQL:
   ```sql
   source init.sql;
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Jalankan server:
   ```bash
   npm start
   ```

## User contoh
- Username: `superadmin` / `apoteker` / `dokter`
- Password: `admin123`

## Contoh request

### Login
POST `/api/auth/login`

Body:
```json
{
  "username": "superadmin",
  "password": "admin123"
}
```

### Lihat obat
GET `/api/medicines`
Header:
```
Authorization: Bearer <token>
```

### Tambah obat masal
POST `/api/medicines/bulk`
Header:
```
Authorization: Bearer <token>
```

Body:
```json
{
  "medicines": [
    { "name": "Paracetamol", "stock": 100, "unit": "tablet", "category": "Analgesik", "expiration_date": "2025-12-31" },
    { "name": "Amoxicillin", "stock": 50, "unit": "capsule", "category": "Antibiotik", "expiration_date": "2026-06-30" }
  ]
}
```

### Hapus obat
DELETE `/api/medicines/1`
Header:
```
Authorization: Bearer <token>
```
