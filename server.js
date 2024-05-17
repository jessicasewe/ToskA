const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app= express();

//middleware to parse json
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running....');
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));