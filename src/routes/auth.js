const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Kết nối với model User

// Hiển thị trang đăng ký
router.get('/register', (req, res) => {
  res.render('register', { error: req.flash('error'), success: req.flash('success') });
});

// Xử lý đăng ký người dùng
router.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Kiểm tra mật khẩu trùng khớp
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/register');
  }

  // Quy tắc mật khẩu: ít nhất 6 ký tự, 1 số và 1 ký tự đặc biệt
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
  if (!passwordRegex.test(password)) {
    req.flash('error', 'Password must be at least 6 characters long, with at least 1 number and 1 special character.');
    return res.redirect('/register');
  }

  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already in use.');
      return res.redirect('/register');
    }

    // Mã hóa mật khẩu và tạo người dùng mới
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Hiển thị trang đăng nhập
router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error'), success: req.flash('success') });
});

// Xử lý đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng trong database
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash('error', 'Email hoặc mật khẩu không đúng.');
      return res.redirect('/login');
    }

    // Lưu thông tin user vào session
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).redirect('/login');
  }
});

// Hiển thị trang dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('dashboard', { user: req.session.user });
});

// Đăng xuất
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/dashboard');
    }
    res.redirect('/login');
  });
});

module.exports = router;