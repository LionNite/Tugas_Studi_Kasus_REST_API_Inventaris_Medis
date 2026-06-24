const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorize('Super Admin', 'Apoteker', 'Dokter'), async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, stock, unit, category, expiration_date FROM medicines');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

router.post('/bulk', authenticate, authorize('Super Admin', 'Apoteker'), async (req, res) => {
    const medicines = req.body.medicines;
    if (!Array.isArray(medicines) || medicines.length === 0) {
        return res.status(400).json({ message: 'Data medicines harus berupa array' });
    }

    const values = medicines.map(item => [item.name, item.stock || 0, item.unit || 'pcs', item.category || null, item.expiration_date || null]);
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
});

router.delete('/:id', authenticate, authorize('Super Admin', 'Apoteker'), async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM medicines WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }
        res.json({ message: 'Obat berhasil dihapus' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

module.exports = router;
