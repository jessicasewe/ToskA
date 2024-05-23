const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const musicRoutes = require('./routes/musicRoutes');
const movieRoutes = require('./routes/movieRoutes');
const connectDB = require('./config/db');
const User = require('./models/user');
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
  const successMessage = req.query.success ? 'Registration successful!' : '';
  res.render('register', { successMessage });
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.redirect('/register?success=true');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user. Please try again later.');
  }
});


// Render the login page
app.get('/login', (req, res) => {
  const successMessage = req.query.success ? 'Login successful!' : '';
  res.render('login', { successMessage });
});


// Handle login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    res.redirect('/dashboard'); // assuming you have a dashboard page
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in. Please try again later.');
  }
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
