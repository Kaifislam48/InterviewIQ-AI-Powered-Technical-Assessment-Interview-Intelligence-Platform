const { body } = require('express-validator');

const updateMilestone = [
  body('weekNumber')
    .isInt({ min: 1 })
    .withMessage('Week number must be a valid positive integer'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['not_started', 'in_progress', 'completed'])
    .withMessage('Invalid milestone status. Must be one of: not_started, in_progress, completed'),
];

module.exports = {
  updateMilestone,
};
