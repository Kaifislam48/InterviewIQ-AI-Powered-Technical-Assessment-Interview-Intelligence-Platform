const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply protect and restrict to admin for all admin subroutes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/users', adminController.listUsers);
router.delete('/users/:id', adminController.removeUser);
router.get('/analytics', adminController.getStats);
router.post('/assessments', adminController.createAssessment);
router.delete('/assessments/:id', adminController.removeAssessment);

module.exports = router;
