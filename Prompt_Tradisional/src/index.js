const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
