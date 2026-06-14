const { getModel, generateContentWithFallback, isMockActive } = require('../ai/gemini.client');
const logger = require('../utils/logger');

// Parse text helper to ensure valid JSON is extracted from Gemini markdown output
const cleanAndParseJson = (text) => {
  try {
    // If it contains markdown code block, extract the JSON
    let cleanText = text.trim();
    if (cleanText.startsWith('```')) {
      const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanText = match[1];
      }
    }
    return JSON.parse(cleanText);
  } catch (error) {
    logger.error(`Failed to parse JSON from Gemini response: ${text}. Error: ${error.message}`);
    throw new Error('AI response parsing failed');
  }
};

const analyzeResume = async (resumeText) => {
  if (isMockActive()) {
    logger.info('Using mock resume analyzer');
    return {
      atsScore: Math.floor(Math.random() * 21) + 70, // 70 to 90
      strengths: [
        'Solid programming fundamentals in JavaScript/Python',
        'Good understanding of server-side MVC architecture',
        'Familiarity with SQL and NoSQL database schemas'
      ],
      weaknesses: [
        'Lack of cloud deployment metrics (AWS, GCP, etc.)',
        'Minimal coverage of testing methodologies (Jest, PyTest)',
        'Vague quantification of project impacts and metrics'
      ],
      improvements: [
        'Add quantitative achievements (e.g., "reduced latency by 20%")',
        'Incorporate cloud infrastructure keywords',
        'Detail testing coverage percentages in key projects'
      ],
      missingSkills: ['Docker', 'AWS S3/EC2', 'Jest', 'CI/CD Pipelines'],
      recommendedTopics: ['Dockerization', 'Unit Testing with Jest', 'Git branching workflows']
    };
  }

  try {
    const prompt = `
      You are an expert ATS (Applicant Tracking System) parser and technical hiring manager. 
      Analyze the following resume text and provide feedback.
      
      Output MUST be a valid JSON object matching this structure EXACTLY:
      {
        "atsScore": Number (0-100),
        "strengths": [String],
        "weaknesses": [String],
        "improvements": [String],
        "missingSkills": [String],
        "recommendedTopics": [String]
      }
      
      Resume Text:
      ${resumeText}
    `;

    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    return cleanAndParseJson(text);
  } catch (error) {
    logger.error(`Error in Gemini analyzeResume: ${error.message}`);
    throw error;
  }
};

const generateQuestions = async (role, experienceLevel, techStack, difficulty) => {
  if (isMockActive()) {
    logger.info('Using mock interview generator');
    const techs = techStack && techStack.length ? techStack : ['General programming'];
    return [
      {
        questionText: `Explain core concepts of ${techs[0]} and how you manage state and errors in a production environment.`,
        questionType: 'technical'
      },
      {
        questionText: `Under the hood, how does data flow and caching operate when using ${techs.join(', ')}?`,
        questionType: 'technical'
      },
      {
        questionText: `What are some typical bottlenecks you experience with ${techs[0]} and what design patterns resolve them?`,
        questionType: 'technical'
      },
      {
        questionText: 'Tell me about a challenging bug you faced. How did you diagnose, resolve, and prevent it from recurring?',
        questionType: 'behavioral'
      },
      {
        questionText: 'Why do you want to join our organization, and how do you align with a team that values fast delivery?',
        questionType: 'hr'
      }
    ];
  }

  try {
    const prompt = `
      You are a senior technical interviewer. Generate an array of interview questions for a candidate with:
      Role: ${role}
      Experience Level: ${experienceLevel}
      Tech Stack: ${techStack.join(', ')}
      Difficulty Level: ${difficulty}

      Provide 5 questions:
      - 3 technical questions focused on the selected tech stack and role difficulty.
      - 1 behavioral question.
      - 1 HR/General question.

      Output MUST be a valid JSON array matching this structure EXACTLY:
      [
        {
          "questionText": "Question string",
          "questionType": "technical" or "behavioral" or "hr"
        }
      ]
    `;

    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    return cleanAndParseJson(text);
  } catch (error) {
    logger.error(`Error in Gemini generateQuestions: ${error.message}`);
    throw error;
  }
};

const evaluateAnswer = async (questionText, questionType, userAnswer) => {
  if (isMockActive()) {
    logger.info('Using mock answer evaluator');
    const lengthFactor = Math.min(userAnswer.length / 100, 1.0);
    const score = Math.floor(lengthFactor * 4) + 6; // Score between 6 and 10
    return {
      score,
      feedback: `Your response was structured. ${userAnswer.length < 50 ? 'However, you could expand more on the architectural trade-offs and edge cases.' : 'You explained the core mechanics well.'}`,
      metrics: {
        technicalAccuracy: score,
        communication: Math.floor(Math.random() * 3) + 7, // 7-9
        problemSolving: Math.floor(Math.random() * 3) + 7, // 7-9
        confidence: Math.floor(Math.random() * 2) + 8, // 8-9
      }
    };
  }

  try {
    const prompt = `
      You are a strict technical interviewer. Evaluate the candidate's response to the given question.
      
      Question: "${questionText}" (Type: ${questionType})
      Candidate Answer: "${userAnswer}"

      Evaluate their response and grade them on a scale of 0 to 10.
      Provide scores for technicalAccuracy, communication, problemSolving, and confidence.
      Provide detailed, constructive overall feedback.

      Output MUST be a valid JSON object matching this structure EXACTLY:
      {
        "score": Number (0-10),
        "feedback": "Your detailed feedback",
        "metrics": {
          "technicalAccuracy": Number (0-10),
          "communication": Number (0-10),
          "problemSolving": Number (0-10),
          "confidence": Number (0-10)
        }
      }
    `;

    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    return cleanAndParseJson(text);
  } catch (error) {
    logger.error(`Error in Gemini evaluateAnswer: ${error.message}`);
    throw error;
  }
};

const generateLearningPlan = async (performanceSummary) => {
  if (isMockActive()) {
    logger.info('Using mock learning plan generator');
    return {
      weeklyRoadmap: [
        {
          weekNumber: 1,
          theme: 'Asynchronous Programming & Core Design Patterns',
          topics: ['Event Loop', 'Callback Queue', 'Promises & Async/Await', 'Singleton and Factory patterns'],
          recommendedResources: ['MDN Asynchronous JS guide', 'JavaScript Info - Promises & async/await']
        },
        {
          weekNumber: 2,
          theme: 'Database Indexing & Query Optimizations',
          topics: ['Mongoose Schemas & Indexes', 'Aggregation Pipeline optimization', 'NoSQL scaling principles'],
          recommendedResources: ['MongoDB University: M121 Aggregation Course', 'Index Performance Tuning guide']
        },
        {
          weekNumber: 3,
          theme: 'SaaS Security & Clean Deployments',
          topics: ['JWT token flow & Rotations', 'XSS & SQL/NoSQL Injection mitigation', 'Docker Compose configs'],
          recommendedResources: ['OWASP Top 10 guidelines', 'Docker Docs getting started']
        }
      ],
      weakAreas: ['System Performance Tuning', 'Modern Unit Testing setups', 'Secure Token Refresh logic']
    };
  }

  try {
    const prompt = `
      You are an expert technical tutor. Create a personalized 3-week study roadmap based on the candidate's profile:
      ${performanceSummary}

      Identify 3 distinct week-by-week goals to address their weaknesses.

      Output MUST be a valid JSON object matching this structure EXACTLY:
      {
        "weeklyRoadmap": [
          {
            "weekNumber": Number,
            "theme": "Week topic/theme",
            "topics": [String],
            "recommendedResources": [String]
          }
        ],
        "weakAreas": [String]
      }
    `;

    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    return cleanAndParseJson(text);
  } catch (error) {
    logger.error(`Error in Gemini generateLearningPlan: ${error.message}`);
    throw error;
  }
};

const generateCodingHint = async (problemStatement, currentCode, language) => {
  if (isMockActive()) {
    logger.info('Using mock coding hint generator');
    return {
      hint: 'Think about using a Hash Map to keep track of the elements you have seen so far and their indices.',
      explanation: 'Using a Hash Map allows you to do lookups in O(1) time complexity. For each element, check if the complement (target - current) exists in the map. If it does, you found the solution.'
    };
  }

  try {
    const prompt = `
      You are a helpful coding coach. Give a conceptual hint to a student struggling with a coding challenge.
      DO NOT give the full solution code. Offer clues on algorithmic concepts and edge cases.

      Problem:
      ${problemStatement}

      Language: ${language}
      Student's current code:
      ${currentCode}

      Output MUST be a valid JSON object matching this structure EXACTLY:
      {
        "hint": "Conceptual hint here",
        "explanation": "Brief explanation of how this logic fits the problem"
      }
    `;

    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    return cleanAndParseJson(text);
  } catch (error) {
    logger.error(`Error in Gemini generateCodingHint: ${error.message}`);
    throw error;
  }
};

const evaluateCode = async (challengeTitle, challengeDescription, testCases, userCode, language) => {
  const isStarter = 
    userCode.includes('// Write your') || 
    userCode.includes('# Write your') || 
    userCode.includes('// Write starter') ||
    userCode.includes('// Write code') ||
    userCode.includes('pass') || 
    userCode.trim().length < 50;

  if (isStarter) {
    return {
      status: 'Failed',
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      logs: 'Compilation Error: Empty or unmodified starter code. Please write your solution before running.'
    };
  }

  if (isMockActive()) {
    logger.info(`Using mock code runner for ${language}`);
    return {
      status: 'Passed',
      testCasesPassed: testCases.length,
      totalTestCases: testCases.length,
      logs: `[Mock Compilation Success]\n${language.toUpperCase()} test assertions passed. All test cases passed.`
    };
  }

  try {
    const prompt = `
      You are an automated code evaluator. You are testing a student's solution to a coding challenge.
      
      Challenge Title: "${challengeTitle}"
      Challenge Description:
      "${challengeDescription}"
      
      Programming Language: "${language}"
      Student's Code:
      \`\`\`${language}
      ${userCode}
      \`\`\`
      
      Test Cases to run:
      ${JSON.stringify(testCases, null, 2)}
      
      Evaluate the student's solution. Determine:
      1. If there are syntax or logic errors.
      2. How many test cases compile and pass.
      
      Output MUST be a valid JSON object matching this structure EXACTLY:
      {
        "status": "Passed" or "Failed" or "Compilation Error",
        "testCasesPassed": Number (integer, how many test cases passed),
        "totalTestCases": ${testCases.length},
        "logs": "Detailed compilation and assertion run logs."
      }
    `;

    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    return cleanAndParseJson(text);
  } catch (error) {
    logger.error(`Error in Gemini evaluateCode: ${error.message}`);
    return {
      status: 'Failed',
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      logs: `Evaluation Error: ${error.message}`
    };
  }
};

module.exports = {
  analyzeResume,
  generateQuestions,
  evaluateAnswer,
  generateLearningPlan,
  generateCodingHint,
  evaluateCode,
};
