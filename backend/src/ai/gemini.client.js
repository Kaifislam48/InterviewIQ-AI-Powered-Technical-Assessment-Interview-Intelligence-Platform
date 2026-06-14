const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const logger = require('../utils/logger');

let genAI = null;
let useMock = true;

if (env.NODE_ENV === 'test') {
  logger.info('Running in Jest test mode. Forcing mock AI services.');
  useMock = true;
} else if (env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'test_fallback_value') {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    useMock = false;
    logger.info('Gemini API client initialized successfully.');
  } catch (error) {
    logger.error(`Failed to initialize Gemini API client: ${error.message}. Falling back to mock data.`);
    useMock = true;
  }
} else {
  logger.warn('GEMINI_API_KEY is not defined. Using mock AI services.');
  useMock = true;
}

// Get the generative model
const getModel = (modelName = env.GEMINI_MODEL) => {
  if (useMock) return null;
  const config = {
    model: modelName,
    generationConfig: {}
  };
  const isLegacyPro = modelName.toLowerCase() === 'gemini-pro' || modelName.toLowerCase() === 'gemini-1.0-pro';
  if (!isLegacyPro) {
    config.generationConfig.responseMimeType = 'application/json';
  }
  return genAI.getGenerativeModel(config);
};

// Generates content and automatically falls back to other model versions if one fails (e.g. 404 not found)
const generateContentWithFallback = async (prompt) => {
  if (useMock) {
    return null;
  }

  const modelsToTry = [
    env.GEMINI_MODEL,
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemini-pro'
  ].filter(Boolean);

  const uniqueModels = [...new Set(modelsToTry)];
  let lastError = null;

  for (const modelName of uniqueModels) {
    try {
      logger.info(`Attempting Gemini content generation with model: ${modelName}`);
      const model = getModel(modelName);
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      lastError = error;
      logger.warn(`Model ${modelName} failed during generation: ${error.message}`);
      // Continue to try the next model
    }
  }

  logger.error(`All Gemini models failed: ${lastError.message}`);
  throw lastError;
};

module.exports = {
  getModel,
  generateContentWithFallback,
  isMockActive: () => useMock,
};
