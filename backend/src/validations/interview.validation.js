const { body } = require('express-validator');

const startInterview = [
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Interview role is required'),
  body('experienceLevel')
    .trim()
    .notEmpty()
    .withMessage('Experience level is required')
    .isIn(['entry', 'mid', 'senior', 'Entry', 'Mid', 'Senior'])
    .withMessage('Invalid experience level'),
  body('techStack')
    .isArray({ min: 1 })
    .withMessage('Tech stack must be a non-empty array of technologies'),
  body('techStack.*')
    .trim()
    .notEmpty()
    .withMessage('Tech stack technology cannot be blank'),
  body('difficulty')
    .trim()
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['easy', 'medium', 'hard', 'Easy', 'Medium', 'Hard'])
    .withMessage('Invalid difficulty level'),
];

const submitAnswer = [
  body('answer')
    .trim()
    .notEmpty()
    .withMessage('Answer cannot be empty')
    .isLength({ max: 5000 })
    .withMessage('Answer cannot exceed 5000 characters'),
];

module.exports = {
  startInterview,
  submitAnswer,
};
