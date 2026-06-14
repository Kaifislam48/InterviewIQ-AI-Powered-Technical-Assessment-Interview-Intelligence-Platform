const express = require('express');
const codingController = require('../controllers/coding.controller');
const codingValidation = require('../validations/coding.validation');
const validate = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect);

router.get('/challenges', codingController.listChallenges);
router.get('/history', codingController.getSubmissionsHistory);
router.get('/challenges/:id', codingController.getChallenge);
router.post('/submit/:id', codingValidation.submitOrHint, validate, codingController.submitCode);
router.post('/hint/:id', codingValidation.submitOrHint, validate, codingController.requestHint);

module.exports = router;
