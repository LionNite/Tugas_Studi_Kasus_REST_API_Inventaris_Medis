const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post(
    '/login',
    [
        body('username').trim().notEmpty().withMessage('Username diperlukan'),
        body('password').notEmpty().withMessage('Password diperlukan'),
    ],
    validateRequest,
    async (req, res) => {
        const { username, password } = req.body;
        try {
        const [rows] = await pool.query('SELECT id, username, password_hash, role FROM users WHERE username = ?', [username]);
        if (!rows.length) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        const user = rows[0];
        const passwordValid = await bcrypt.compare(password, user.password_hash);
        if (!passwordValid) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
);

module.exports = router;
