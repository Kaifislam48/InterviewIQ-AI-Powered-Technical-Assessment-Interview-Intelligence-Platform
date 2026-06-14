const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const errorHandler = require('./middleware/error.middleware');
const { NotFoundError } = require('./utils/errors');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const resumeRoutes = require('./routes/resume.routes');
const interviewRoutes = require('./routes/interview.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const codingRoutes = require('./routes/coding.routes');
const adminRoutes = require('./routes/admin.routes');
const learningPlanRoutes = require('./routes/learningPlan.routes');

const app = express();

// 1. Security Middlewares
app.use(helmet());
app.use(cors());

// 2. Logging
app.use(morgan('dev'));

// 3. Parser Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate Limiter (Apply general API limits to all requests)
app.use('/api', apiLimiter);

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/learning', learningPlanRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'InterviewIQ server is healthy!' });
});

// 6. Handle 404 Undefined Routes
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// 7. Global Error Handler
app.use(errorHandler);

module.exports = app;
