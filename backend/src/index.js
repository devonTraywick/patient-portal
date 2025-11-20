require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {sequelize} = require('./models');

const authRoutes = require('./routes/auth');
const apptRoutes = require('./routes/appointments');
const providerRoutes = require('./routes/providers');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',  // frontend
  credentials: true
}));
app.use(express.json());

//small health route
app.get('/api/health', (req, res) => res.json({status: 'OK'}));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', apptRoutes);
app.use('/api/providers', providerRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        // For prototyping only — in prod use migrations
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();