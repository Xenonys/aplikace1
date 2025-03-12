
    const express = require('express');
const connectDB = require('./config');
const loginRoutes = require('./routes/loginRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Důležité pro komunikaci mezi Electron app a API serverem

// Routes
app.use('/api', loginRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const userRoutes = require('./routes/authRoutes');
app.use('/api/users', userRoutes);
