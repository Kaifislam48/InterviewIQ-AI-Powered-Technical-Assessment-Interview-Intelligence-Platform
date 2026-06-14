const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Question = require('../models/Question');
const CodingChallenge = require('../models/CodingChallenge');
const Assessment = require('../models/Assessment');

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected. Clearing existing data...');

    await User.deleteMany({});
    await Question.deleteMany({});
    await CodingChallenge.deleteMany({});
    await Assessment.deleteMany({});

    console.log('Inserting default users...');
    const admin = await User.create({
      name: 'InterviewIQ Admin',
      email: 'admin@interviewiq.com',
      password: 'AdminPassword123!',
      role: 'admin',
      isVerified: true,
    });

    const candidate = await User.create({
      name: 'John Doe',
      email: 'candidate@interviewiq.com',
      password: 'CandidatePassword123!',
      role: 'candidate',
      isVerified: true,
    });

    console.log('Inserting MCQ Questions...');
    const mcqQuestions = await Question.insertMany([
      {
        questionText: 'Which of the following is true about Node.js?',
        options: [
          'It is multi-threaded and synchronous by default',
          'It runs on the V8 JavaScript engine and is single-threaded',
          'It is a client-side programming framework',
          'It does not support asynchronous operations'
        ],
        correctOptions: [1],
        difficulty: 'easy',
        topics: ['Node.js', 'JavaScript'],
        explanation: 'Node.js is a single-threaded, asynchronous runtime built on Google Chrome V8 engine.'
      },
      {
        questionText: 'What is the purpose of React Hook useEffect?',
        options: [
          'To directly manipulate the DOM structure',
          'To perform side effects in functional components',
          'To style the components dynamically',
          'To create deep copies of states'
        ],
        correctOptions: [1],
        difficulty: 'easy',
        topics: ['React', 'JavaScript'],
        explanation: 'useEffect Hook lets you perform side effects in function components, replacing lifecycle methods.'
      },
      {
        questionText: 'Which MongoDB feature allows grouping documents and performing operations on them?',
        options: [
          'Indexing',
          'Aggregation Pipeline',
          'Sharding',
          'Replication'
        ],
        correctOptions: [1],
        difficulty: 'medium',
        topics: ['MongoDB', 'Databases'],
        explanation: 'The aggregation framework allows documents to be processed by a sequence of stages to filter, group, and calculate values.'
      },
      {
        questionText: 'In CSS, what is the default value of the position property?',
        options: [
          'relative',
          'absolute',
          'static',
          'fixed'
        ],
        correctOptions: [2],
        difficulty: 'easy',
        topics: ['CSS', 'Frontend'],
        explanation: 'The default position property for HTML elements is static. Elements render in order as they appear in the document flow.'
      },
      {
        questionText: 'What does the JWT signature verify?',
        options: [
          'That the token header and payload have not been tampered with',
          'The user password on every request',
          'The encryption algorithm configuration only',
          'The client browser capabilities'
        ],
        correctOptions: [0],
        difficulty: 'medium',
        topics: ['Security', 'Backend'],
        explanation: 'The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message was not changed along the way.'
      }
    ]);

    console.log('Inserting Coding Challenges...');
    const codingChallenges = await CodingChallenge.insertMany([
      {
        title: 'Two Sum',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
        difficulty: 'easy',
        category: 'Arrays',
        inputFormat: 'Line 1: A comma-separated list of integers representing `nums`.\nLine 2: An integer representing `target`.',
        outputFormat: 'A comma-separated list of two indices.',
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
        sampleInput: '2,7,11,15\n9',
        sampleOutput: '0,1',
        testCases: [
          { input: '2,7,11,15\n9', expectedOutput: '0,1', isHidden: false },
          { input: '3,2,4\n6', expectedOutput: '1,2', isHidden: false },
          { input: '3,3\n6', expectedOutput: '0,1', isHidden: true }
        ],
        starterCode: [
          {
            language: 'javascript',
            code: 'function twoSum(nums, target) {\n    // Write your code here\n}'
          },
          {
            language: 'python',
            code: 'def two_sum(nums, target):\n    # Write your code here\n    pass'
          }
        ]
      },
      {
        title: 'Reverse a String',
        description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.',
        difficulty: 'easy',
        category: 'Strings',
        inputFormat: 'A single line containing the string characters separated by commas.',
        outputFormat: 'The reversed characters separated by commas.',
        constraints: '1 <= s.length <= 10^5',
        sampleInput: 'h,e,l,l,o',
        sampleOutput: 'o,l,l,e,h',
        testCases: [
          { input: 'h,e,l,l,o', expectedOutput: 'o,l,l,e,h', isHidden: false },
          { input: 'H,a,n,n,a,h', expectedOutput: 'h,a,n,n,a,H', isHidden: false },
          { input: 'a', expectedOutput: 'a', isHidden: true }
        ],
        starterCode: [
          {
            language: 'javascript',
            code: 'function reverseString(s) {\n    // Write your code here\n}'
          },
          {
            language: 'python',
            code: 'def reverse_string(s):\n    # Write your code here\n    pass'
          }
        ]
      },
      {
        title: 'Valid Parentheses',
        description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.',
        difficulty: 'easy',
        category: 'Stack',
        inputFormat: 'A single string containing parentheses.',
        outputFormat: 'true or false',
        constraints: '1 <= s.length <= 10^4',
        sampleInput: '()[]{}',
        sampleOutput: 'true',
        testCases: [
          { input: '()[]{}', expectedOutput: 'true', isHidden: false },
          { input: '(]', expectedOutput: 'false', isHidden: false },
          { input: '{[]}', expectedOutput: 'true', isHidden: true }
        ],
        starterCode: [
          {
            language: 'javascript',
            code: 'function isValid(s) {\n    // Write your code here\n}'
          },
          {
            language: 'python',
            code: 'def is_valid(s):\n    # Write your code here\n    pass'
          }
        ]
      }
    ]);

    console.log('Inserting MCQ Assessment...');
    await Assessment.create({
      title: 'Full Stack Core Assessment',
      description: 'Test your knowledge on Node.js runtime, React state flow, MongoDB querying, and JWT Security rules.',
      type: 'mcq',
      duration: 15,
      questions: mcqQuestions.map((q) => q._id),
      createdBy: admin._id,
    });

    console.log('Inserting Coding Assessment...');
    await Assessment.create({
      title: 'Basic Algorithms Coding Assessment',
      description: 'Solve core algorithmic challenges on Arrays, Strings, and Stack data structures.',
      type: 'coding',
      duration: 30,
      codingChallenges: codingChallenges.map((c) => c._id),
      createdBy: admin._id,
    });

    console.log('Database successfully seeded! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error);
    process.exit(1);
  }
};

seedData();
