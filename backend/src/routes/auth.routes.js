const express = require('express');
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const validate = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

// Apply auth rate limiter for registration, login, forgot password, reset password
router.post('/register', authLimiter, authValidation.register, validate, authController.register);
router.post('/login', authLimiter, authValidation.login, validate, authController.login);
router.post('/refresh', authController.refresh);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authLimiter, authValidation.forgotPassword, validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, authValidation.resetPassword, validate, authController.resetPassword);
router.post('/logout', authController.logout);

module.exports = router;
