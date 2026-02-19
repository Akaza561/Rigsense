const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

const buildRoutes = require('./routes/buildRoute');

// Routes
app.get('/', (req, res) => {
    res.send('RIGSENSE API is running...');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is healthy' });
});

app.use('/api/build', buildRoutes);
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/components', require('./routes/componentRoutes'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
