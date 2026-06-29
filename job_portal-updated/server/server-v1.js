var express = require('express');

const db = require('./config/db');
 
var app = express();

require('dotenv').config();
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
 
const authRoutes = require('./routes/v1/auth_route');

app.use('/api/v1/auth', authRoutes);
 
// app.post('/upload', upload.single('file'), (req, res) => {
//   res.json({ message: 'File uploaded successfully', file: req.file });
// });
 
// cron.schedule('*/5 * * * *', async () => {
//   try {
//     const [result] = await mysql.query(`
//             DELETE FROM tbl_otp WHERE expires_at < NOW()
//             AND created_at < NOW() - INTERVAL 1 DAY;`);
//     console.log(`OTP Cleanup: ${result.affectedRows} rows deleted`);
//   }
//   catch (error) {
//     console.log("OTP Cron Error:", error);
//   }
// });
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
  try {
    if (db) {
      console.log('Database connection established successfully');
    }
    else {
      console.log('Failed to establish database connection');
    }
    console.log(`Server is running on port ${PORT}`);

  }
  catch (err) {
    console.log(`Error in starting server`, err);
  }
});

app.post('/test', (req, res) => {
    console.log("testttt")
    return null
});