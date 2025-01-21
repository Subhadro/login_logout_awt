const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
// Use cookie-parser middleware
const app = express();
app.use(cookieParser());  // This will parse cookies and add them to `req.cookies`

app.use(express.json()); // To parse JSON request body
app.use(express.urlencoded({ extended: true })); // To parse form data

// Database connection
const dbConnect = require('./config/database');
dbConnect();
app.use(cors({
    origin: '*',
}));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use("/api/v1/users", userRoutes);



// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});