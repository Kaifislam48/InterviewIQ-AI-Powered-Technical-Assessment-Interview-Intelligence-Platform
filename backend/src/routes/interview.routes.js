const express = require('express');
const interviewController = require('../controllers/interview.controller');
const interviewValidation = require('../validations/interview.validation');
const validate = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect);

router.post('/generate', interviewValidation.startInterview, validate, interviewController.startInterview);
router.post('/:id/answer', interviewValidation.submitAnswer, validate, interviewController.submitAnswer);
router.get('/history', interviewController.getHistory);
router.get('/:id', interviewController.getSession);

module.exports = router;
