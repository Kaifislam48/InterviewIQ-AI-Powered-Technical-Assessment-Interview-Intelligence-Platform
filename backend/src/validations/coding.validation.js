const { body } = require('express-validator');

const submitOrHint = [
  body('code')
    .notEmpty()
    .withMessage('Code submission is required'),
  body('language')
    .trim()
    .notEmpty()
    .withMessage('Programming language is required')
    .isIn(['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'ruby', 'typescript'])
    .withMessage('Unsupported programming language option'),
];

module.exports = {
  submitOrHint,
};
