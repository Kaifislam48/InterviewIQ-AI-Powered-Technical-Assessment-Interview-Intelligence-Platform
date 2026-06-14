const express = require('express');
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');
const validate = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/dashboard-metrics', userController.getDashboardData);
router.put('/profile', userValidation.updateProfile, validate, userController.updateProfile);

module.exports = router;
