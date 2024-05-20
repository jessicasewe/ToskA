const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

// Database Connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
