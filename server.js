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
    // Extract user data from the request body
    const { name, email, password } = req.body;

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    // Redirect to the registration page with a success message
    res.redirect('/register?success=true');
  } catch (error) {
    // Handle any errors that occur during user registration
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user. Please try again later.');
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
