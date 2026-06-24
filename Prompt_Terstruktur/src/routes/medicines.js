const express = require('express');
const { body, param, validationResult } = require('express-validator');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateExpirationDate = (value) => {
    if (!value) return null;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : value;
};

router.get('/', authenticate, authorize('Super Admin', 'Apoteker', 'Dokter'), async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, stock, unit, category, expiration_date FROM medicines');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

router.get(
    '/:id',
    authenticate,
    authorize('Super Admin', 'Apoteker', 'Dokter'),
    [param('id').isInt({ min: 1 }).withMessage('ID harus berupa angka positif')],
    validateRequest,
    async (req, res) => {
        const { id } = req.params;
        try {
        const [rows] = await pool.query('SELECT id, name, stock, unit, category, expiration_date FROM medicines WHERE id = ?', [id]);
        if (!rows.length) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }
        res.json(rows[0]);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
);

router.post(
    '/',
    authenticate,
    authorize('Super Admin', 'Apoteker'),
    [
        body('name').trim().notEmpty().withMessage('Nama obat/alatal kesehatan diperlukan'),
        body('stock').isInt({ min: 0 }).withMessage('Stock harus angka bulat >= 0'),
        body('unit').trim().notEmpty().withMessage('Unit diperlukan'),
        body('category').optional({ nullable: true }).trim(),
        body('expiration_date').optional({ nullable: true }).isISO8601().withMessage('Expiration date harus format ISO 8601'),
    ],
    validateRequest,
    async (req, res) => {
        const { name, stock, unit, category, expiration_date } = req.body;
        try {
        const [result] = await pool.query(
            'INSERT INTO medicines (name, stock, unit, category, expiration_date) VALUES (?, ?, ?, ?, ?)',
            [name, stock, unit, category || null, expiration_date || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Obat berhasil dibuat' });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
);

router.post(
    '/bulk',
    authenticate,
    authorize('Super Admin', 'Apoteker'),
    [body('medicines').isArray({ min: 1 }).withMessage('Data medicines harus berupa array dengan minimal 1 item')],
    validateRequest,
    async (req, res) => {
        const medicines = req.body.medicines;
        const values = [];

        for (const [index, item] of medicines.entries()) {
        if (!item || typeof item !== 'object') {
            return res.status(400).json({ message: `Item index ${index} tidak valid` });
        }

        const name = typeof item.name === 'string' ? item.name.trim() : '';
        const stock = Number.isInteger(item.stock) ? item.stock : Number(item.stock);
        const unit = typeof item.unit === 'string' ? item.unit.trim() : '';
        const category = item.category ? String(item.category).trim() : null;
        const expiration_date = item.expiration_date ? String(item.expiration_date).trim() : null;

        if (!name) {
            return res.status(400).json({ message: `Item index ${index} nama harus diisi` });
        }
        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({ message: `Item index ${index} stock harus integer >= 0` });
        }
        if (!unit) {
            return res.status(400).json({ message: `Item index ${index} unit harus diisi` });
        }
        if (expiration_date && !validateExpirationDate(expiration_date)) {
            return res.status(400).json({ message: `Item index ${index} expiration_date tidak valid` });
        }

        values.push([name, stock, unit, category, expiration_date || null]);
        }

        try {
        const [result] = await pool.query(
            'INSERT INTO medicines (name, stock, unit, category, expiration_date) VALUES ? ON DUPLICATE KEY UPDATE stock = stock + VALUES(stock)',
            [values]
        );
        res.status(201).json({ inserted: result.affectedRows, message: 'Obat berhasil ditambahkan secara masal' });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
);

router.put(
    '/:id',
    authenticate,
    authorize('Super Admin', 'Apoteker'),
    [
        param('id').isInt({ min: 1 }).withMessage('ID harus berupa angka positif'),
        body('name').optional().trim().notEmpty().withMessage('Nama tidak boleh kosong'),
        body('stock').optional().isInt({ min: 0 }).withMessage('Stock harus angka bulat >= 0'),
        body('unit').optional().trim().notEmpty().withMessage('Unit tidak boleh kosong'),
        body('category').optional({ nullable: true }).trim(),
        body('expiration_date').optional({ nullable: true }).isISO8601().withMessage('Expiration date harus format ISO 8601'),
    ],
    validateRequest,
    async (req, res) => {
        const { id } = req.params;
        const { name, stock, unit, category, expiration_date } = req.body;
        const fields = [];
        const values = [];

        if (name !== undefined) {
        fields.push('name = ?');
        values.push(name);
        }
        if (stock !== undefined) {
        fields.push('stock = ?');
        values.push(stock);
        }
        if (unit !== undefined) {
        fields.push('unit = ?');
        values.push(unit);
        }
        if (category !== undefined) {
        fields.push('category = ?');
        values.push(category || null);
        }
        if (expiration_date !== undefined) {
        fields.push('expiration_date = ?');
        values.push(expiration_date || null);
        }

        if (!fields.length) {
        return res.status(400).json({ message: 'Tidak ada data yang diubah' });
        }

        try {
        const [existing] = await pool.query('SELECT id FROM medicines WHERE id = ?', [id]);
        if (!existing.length) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }

        values.push(id);
        await pool.query(`UPDATE medicines SET ${fields.join(', ')} WHERE id = ?`, values);
        res.json({ message: 'Obat berhasil diperbarui' });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
);

router.delete(
    '/:id',
    authenticate,
    authorize('Super Admin', 'Apoteker'),
    [param('id').isInt({ min: 1 }).withMessage('ID harus berupa angka positif')],
    validateRequest,
    async (req, res) => {
        const { id } = req.params;
        try {
        const [existing] = await pool.query('SELECT id FROM medicines WHERE id = ?', [id]);
        if (!existing.length) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }

        await pool.query('DELETE FROM medicines WHERE id = ?', [id]);
        res.json({ message: 'Obat berhasil dihapus' });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
);

module.exports = router;
