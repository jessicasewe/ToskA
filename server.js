const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const musicRoutes = require('./routes/musicRoutes');
const movieRoutes = require('./routes/movieRoutes');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api', movieRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Render the register page
app.get('/register', (req, res) => {
  res.render('register');
});

//serve static files
app.use(express.static('public'));


// Database Connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
