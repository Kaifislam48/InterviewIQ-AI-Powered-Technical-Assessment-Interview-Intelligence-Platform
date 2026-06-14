const express = require('express');
const learningPlanController = require('../controllers/learningPlan.controller');
const learningPlanValidation = require('../validations/learningPlan.validation');
const validate = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect);

router.get('/plan', learningPlanController.getPlan);
router.post('/plan/regenerate', learningPlanController.regeneratePlan);
router.post('/plan/milestone', learningPlanValidation.updateMilestone, validate, learningPlanController.updateMilestone);

module.exports = router;
