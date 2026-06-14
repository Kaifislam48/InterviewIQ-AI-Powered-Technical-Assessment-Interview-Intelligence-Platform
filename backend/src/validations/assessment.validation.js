const { body } = require('express-validator');

const submitAssessment = [
  body('timeTaken')
    .isNumeric({ min: 0 })
    .withMessage('Time taken must be a non-negative number of seconds'),
  body('answers')
    .isArray()
    .withMessage('Answers must be a valid list/array'),
  body('answers.*.questionId')
    .optional()
    .isMongoId()
    .withMessage('Question ID must be a valid Mongo ID'),
  body('answers.*.selectedOptions')
    .optional()
    .isArray()
    .withMessage('Selected options must be an array'),
  body('answers.*.codingChallengeId')
    .optional()
    .isMongoId()
    .withMessage('Coding Challenge ID must be a valid Mongo ID'),
  body('answers.*.submittedCode')
    .optional()
    .isString()
    .withMessage('Submitted code must be a string'),
  body('answers.*.language')
    .optional()
    .isString()
    .isIn(['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'ruby', 'typescript'])
    .withMessage('Invalid answer language choice'),
];

module.exports = {
  submitAssessment,
};
