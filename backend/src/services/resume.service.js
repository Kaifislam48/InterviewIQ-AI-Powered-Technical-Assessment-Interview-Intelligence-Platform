const fileParser = require('../helpers/fileParser');
const geminiService = require('./gemini.service');
const resumeRepository = require('../repositories/ResumeRepository');
const { BadRequestError } = require('../utils/errors');

const analyzeUserResume = async (userId, file) => {
  if (!file) {
    throw new BadRequestError('Resume file is required');
  }

  // 1. Extract text from uploaded document
  const extractedText = await fileParser.extractTextFromFile(file);
  
  if (!extractedText || extractedText.trim().length < 50) {
    throw new BadRequestError('Could not extract sufficient text from the resume. Please check the file format.');
  }

  // 2. Query Gemini ATS parser
  const analysisResult = await geminiService.analyzeResume(extractedText);

  // 3. Save to database
  const resume = await resumeRepository.create({
    userId,
    fileName: file.originalname,
    atsScore: analysisResult.atsScore,
    strengths: analysisResult.strengths,
    weaknesses: analysisResult.weaknesses,
    improvements: analysisResult.improvements,
    missingSkills: analysisResult.missingSkills,
    recommendedTopics: analysisResult.recommendedTopics,
    rawAnalysis: analysisResult,
  });

  return resume;
};

const getResumeHistory = async (userId) => {
  return resumeRepository.findByUserId(userId);
};

const getLatestResume = async (userId) => {
  return resumeRepository.findLatestByUserId(userId);
};

module.exports = {
  analyzeUserResume,
  getResumeHistory,
  getLatestResume,
};
