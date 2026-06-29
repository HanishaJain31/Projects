const express = require("express");
const db = require("./config/db");
const env = require("dotenv");
var multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
env.config();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

const authRoutes = require('./routes/v1/auth_route');
const adminRoutes = require('./routes/v1/admin_route');
const userRoutes = require('./routes/v1/user_route');

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// app.use((err, req, res, next) => {
//     console.log("JSON ERROR:", err.message);
//     res.status(400).json({
//         error: err.message
//     });
// });

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/user', userRoutes);

const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads'));

try {
  app.listen(process.env.PORT);
  console.log(`Server running on port ${process.env.PORT}`);
  
  bcrypt.hash("admin123", 10, (err, hashedPassword) => {
    console.log(hashedPassword)
  });

  bcrypt.hash("Hanisha123", 10, (err, hashedPassword) => {
    console.log(hashedPassword)
  });
} catch (error) {
  console.log(error);
}

 