const express = require('express');
const assessmentController = require('../controllers/assessment.controller');
const assessmentValidation = require('../validations/assessment.validation');
const validate = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect);

router.get('/list', assessmentController.listAssessments);
router.get('/history', assessmentController.getAttemptsHistory);
router.get('/attempts/:id', assessmentController.getAttemptDetails);
router.get('/:id', assessmentController.getAssessment);
router.post('/:id/submit', assessmentValidation.submitAssessment, validate, assessmentController.submitAttempt);

module.exports = router;
