$(document).ready(function () {
  $('#registerForm').submit(function (e) {
    const password = $('input[name="password"]').val();
    const confirmPassword = $('input[name="confirmPassword"]').val();
    const email = $('input[name="email"]').val();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;

    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ!');
      e.preventDefault();
    } else if (!passwordRegex.test(password)) {
      alert('Mật khẩu phải có ít nhất 6 ký tự, 1 số và 1 ký tự đặc biệt.');
      e.preventDefault();
    } else if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      e.preventDefault();
    }
  });
});