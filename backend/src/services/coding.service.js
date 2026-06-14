const codingChallengeRepository = require('../repositories/CodingChallengeRepository');
const codingSubmissionRepository = require('../repositories/CodingSubmissionRepository');
const geminiService = require('./gemini.service');
const { runTestCases } = require('../utils/codeRunner');
const { NotFoundError, BadRequestError } = require('../utils/errors');

const getChallenges = async (category, difficulty) => {
  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  return codingChallengeRepository.findAll(filter);
};

const getChallengeById = async (id) => {
  const challenge = await codingChallengeRepository.findById(id);
  if (!challenge) {
    throw new NotFoundError('Coding challenge not found');
  }
  return challenge;
};

const submitChallenge = async (userId, challengeId, code, language) => {
  const challenge = await codingChallengeRepository.findById(challengeId);
  if (!challenge) {
    throw new NotFoundError('Coding challenge not found');
  }

  if (!code) {
    throw new BadRequestError('Code submission cannot be empty');
  }

  // 1. Run user code (JavaScript in VM sandbox, others evaluated by AI)
  let runResult;
  if (language === 'javascript') {
    runResult = runTestCases(code, challenge.title, challenge.testCases, language);
  } else {
    runResult = await geminiService.evaluateCode(
      challenge.title,
      challenge.description,
      challenge.testCases,
      code,
      language
    );
  }

  // 2. Save submission details to db
  const submission = await codingSubmissionRepository.create({
    userId,
    challengeId,
    code,
    language,
    status: runResult.status,
    testCasesPassed: runResult.testCasesPassed,
    totalTestCases: runResult.totalTestCases,
  });

  return {
    submissionId: submission._id,
    status: submission.status,
    testCasesPassed: submission.testCasesPassed,
    totalTestCases: submission.totalTestCases,
    logs: runResult.logs,
  };
};

const getChallengeHint = async (challengeId, currentCode, language) => {
  const challenge = await codingChallengeRepository.findById(challengeId);
  if (!challenge) {
    throw new NotFoundError('Coding challenge not found');
  }

  // Request hint from Gemini API
  const hintResult = await geminiService.generateCodingHint(
    challenge.description,
    currentCode || '// Write starter code here',
    language || 'javascript'
  );

  return hintResult;
};

const getUserSubmissions = async (userId) => {
  return codingSubmissionRepository.findByUserId(userId);
};

module.exports = {
  getChallenges,
  getChallengeById,
  submitChallenge,
  getChallengeHint,
  getUserSubmissions,
};
