const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateEmail = body('email').isEmail().normalizeEmail();
const validatePassword = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');
const validateUsername = body('username').trim().notEmpty().withMessage('Username is required');

// Register route
router.post(
  '/register',
  [validateEmail, validatePassword, validateUsername],
  authController.register
);

// Login route
router.post(
  '/login',
  [validateEmail, validatePassword],
  authController.login
);

// Refresh token route
router.post('/refresh', authController.refresh);

// Logout route (client-side token management)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
