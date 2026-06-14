const interviewRepository = require('../repositories/InterviewRepository');
const geminiService = require('./gemini.service');
const { NotFoundError, BadRequestError } = require('../utils/errors');

const startNewInterview = async (userId, role, experienceLevel, techStack, difficulty) => {
  // 1. Ask Gemini to generate questions
  const generatedQuestions = await geminiService.generateQuestions(
    role,
    experienceLevel,
    techStack,
    difficulty
  );

  if (!generatedQuestions || !generatedQuestions.length) {
    throw new BadRequestError('Failed to generate interview questions. Please try again.');
  }

  // 2. Format questions
  const formattedQuestions = generatedQuestions.map((q) => ({
    questionText: q.questionText,
    questionType: q.questionType,
    userAnswer: '',
    evaluation: {
      score: 0,
      feedback: '',
      metrics: {
        technicalAccuracy: 0,
        communication: 0,
        problemSolving: 0,
        confidence: 0,
      },
    },
  }));

  // 3. Save Interview session in database
  const interview = await interviewRepository.create({
    userId,
    role,
    experienceLevel,
    techStack,
    difficulty,
    status: 'active',
    currentQuestionIndex: 0,
    questions: formattedQuestions,
  });

  return {
    interviewId: interview._id,
    role: interview.role,
    totalQuestions: interview.questions.length,
    currentQuestionIndex: 0,
    firstQuestion: {
      questionText: interview.questions[0].questionText,
      questionType: interview.questions[0].questionType,
    },
  };
};

const processUserAnswer = async (userId, interviewId, userAnswer) => {
  const interview = await interviewRepository.findById(interviewId);
  if (!interview) {
    throw new NotFoundError('Interview session not found');
  }

  if (interview.userId.toString() !== userId.toString()) {
    throw new BadRequestError('Access denied: You do not own this session');
  }

  if (interview.status === 'completed') {
    throw new BadRequestError('This interview session is already completed');
  }

  const currentIndex = interview.currentQuestionIndex;
  const currentQuestion = interview.questions[currentIndex];

  // 1. Evaluate user answer with Gemini
  const evalResult = await geminiService.evaluateAnswer(
    currentQuestion.questionText,
    currentQuestion.questionType,
    userAnswer || 'No answer provided'
  );

  // 2. Update answer and evaluation in Mongoose subdocument
  currentQuestion.userAnswer = userAnswer || 'No answer provided';
  currentQuestion.evaluation = {
    score: evalResult.score,
    feedback: evalResult.feedback,
    metrics: {
      technicalAccuracy: evalResult.metrics.technicalAccuracy,
      communication: evalResult.metrics.communication,
      problemSolving: evalResult.metrics.problemSolving,
      confidence: evalResult.metrics.confidence,
    },
  };

  // 3. Move to next question or complete interview
  const isLastQuestion = currentIndex === interview.questions.length - 1;

  if (isLastQuestion) {
    interview.status = 'completed';
    
    // Calculate final scores
    let totalScoreSum = 0;
    let techAccSum = 0;
    let commSum = 0;
    let probSolvSum = 0;
    let confSum = 0;

    interview.questions.forEach((q) => {
      totalScoreSum += q.evaluation.score;
      techAccSum += q.evaluation.metrics.technicalAccuracy;
      commSum += q.evaluation.metrics.communication;
      probSolvSum += q.evaluation.metrics.problemSolving;
      confSum += q.evaluation.metrics.confidence;
    });

    const len = interview.questions.length;
    // Scale overallScore from 0-10 average to 0-100%
    interview.overallScore = Math.round((totalScoreSum / len) * 10);
    
    // Formulate a final feedback summary
    interview.overallFeedback = `Mock interview complete! You scored an overall ${interview.overallScore}/100. 
Technical Accuracy: ${Math.round((techAccSum / len) * 10)}/100. 
Communication: ${Math.round((commSum / len) * 10)}/100. 
Problem Solving: ${Math.round((probSolvSum / len) * 10)}/100.`;

    await interview.save();

    return {
      status: 'completed',
      overallScore: interview.overallScore,
      overallFeedback: interview.overallFeedback,
      evaluation: currentQuestion.evaluation,
      report: interview,
    };
  } else {
    interview.currentQuestionIndex = currentIndex + 1;
    await interview.save();

    const nextQuestion = interview.questions[interview.currentQuestionIndex];
    return {
      status: 'active',
      evaluation: currentQuestion.evaluation,
      currentQuestionIndex: interview.currentQuestionIndex,
      nextQuestion: {
        questionText: nextQuestion.questionText,
        questionType: nextQuestion.questionType,
      },
    };
  }
};

const getInterviewHistory = async (userId) => {
  return interviewRepository.findByUserId(userId);
};

const getInterviewSession = async (interviewId) => {
  const session = await interviewRepository.findById(interviewId);
  if (!session) {
    throw new NotFoundError('Interview session not found');
  }
  return session;
};

module.exports = {
  startNewInterview,
  processUserAnswer,
  getInterviewHistory,
  getInterviewSession,
};
