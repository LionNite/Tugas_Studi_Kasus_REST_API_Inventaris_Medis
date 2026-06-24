const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Terlalu banyak request, coba lagi nanti' },
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
