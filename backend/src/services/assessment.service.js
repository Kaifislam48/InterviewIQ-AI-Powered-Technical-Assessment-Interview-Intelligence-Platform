const assessmentRepository = require('../repositories/AssessmentRepository');
const codingChallengeRepository = require('../repositories/CodingChallengeRepository');
const Question = require('../models/Question');
const { runTestCases } = require('../utils/codeRunner');
const { NotFoundError } = require('../utils/errors');

const getAssessments = async (type) => {
  const filter = type ? { type } : {};
  return assessmentRepository.findAll(filter);
};

const getAssessmentById = async (id) => {
  const assessment = await assessmentRepository.findById(id);
  if (!assessment) {
    throw new NotFoundError('Assessment not found');
  }
  return assessment;
};

const submitAssessment = async (userId, assessmentId, timeTaken, submittedAnswers) => {
  const assessment = await assessmentRepository.findById(assessmentId);
  if (!assessment) {
    throw new NotFoundError('Assessment not found');
  }

  let correctCount = 0;
  const gradedAnswers = [];
  const totalQuestions = assessment.questions.length + assessment.codingChallenges.length;

  // 1. Grade MCQ Questions
  for (let question of assessment.questions) {
    const userAnswer = submittedAnswers.find((ans) => ans.questionId === question._id.toString());
    const selectedOptions = userAnswer ? userAnswer.selectedOptions : [];
    
    // Check if correctOptions match selectedOptions (arrays equal)
    const isCorrect = 
      selectedOptions.length === question.correctOptions.length &&
      selectedOptions.every((val, index) => val === question.correctOptions[index]);

    if (isCorrect) {
      correctCount++;
    }

    gradedAnswers.push({
      questionId: question._id,
      selectedOptions,
      passed: isCorrect,
    });
  }

  // 2. Grade Coding Challenges
  for (let challenge of assessment.codingChallenges) {
    const userSubmission = submittedAnswers.find((ans) => ans.codingChallengeId === challenge._id.toString());
    const submittedCode = userSubmission ? userSubmission.submittedCode : '';
    const language = userSubmission ? userSubmission.language : 'javascript';

    let passed = false;
    if (submittedCode) {
      const runResult = runTestCases(submittedCode, challenge.title, challenge.testCases, language);
      passed = runResult.status === 'Passed';
    }

    if (passed) {
      correctCount++;
    }

    gradedAnswers.push({
      codingChallengeId: challenge._id,
      submittedCode,
      language,
      passed,
    });
  }

  // 3. Calculate score out of 100
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = score >= 60; // 60% is passing threshold

  // 4. Save attempt
  const attempt = await assessmentRepository.createAttempt({
    userId,
    assessmentId,
    score,
    passed,
    timeTaken,
    answers: gradedAnswers,
  });

  return attempt;
};

const getUserAttempts = async (userId) => {
  return assessmentRepository.findAttemptsByUserId(userId);
};

const getAttemptDetails = async (attemptId) => {
  return assessmentRepository.findAttemptById(attemptId);
};

module.exports = {
  getAssessments,
  getAssessmentById,
  submitAssessment,
  getUserAttempts,
  getAttemptDetails,
};
