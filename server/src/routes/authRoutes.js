const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  validate({
    username: { required: true, minLength: 3, maxLength: 24, pattern: /^[a-zA-Z0-9_]+$/, message: 'Username must be 3-24 characters (letters, numbers, underscore only)' },
    email: { required: true, pattern: /^\S+@\S+\.\S+$/, message: 'Please provide a valid email address' },
    password: { required: true, minLength: 6, message: 'Password must be at least 6 characters' },
  }),
  register
);

router.post(
  '/login',
  validate({
    email: { required: true, message: 'Email is required' },
    password: { required: true, message: 'Password is required' },
  }),
  login
);

router.get('/me', protect, getMe);

module.exports = router;
