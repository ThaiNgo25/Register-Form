const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth'); // Import routes/auth.js
require('dotenv').config(); // Load environment variables

// Kết nối MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cấu hình middleware
app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu từ form
app.use(express.json()); // Xử lý dữ liệu dạng JSON
app.use(session({
  secret: 'your_secret_key', // Thay bằng secret key của bạn
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

// Thiết lập đường dẫn tới các file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng EJS làm view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sử dụng routes từ auth.js
app.use('/', authRoutes); // Định tuyến cho các route trong auth.js

// Định nghĩa route cho đường dẫn gốc
app.get('/', (req, res) => {
  res.redirect('/login'); // Chuyển hướng đến trang đăng nhập
});

// Lắng nghe server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
//safafafafaf