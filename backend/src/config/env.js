require('dotenv').config();

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'GEMINI_API_KEY'];

// Verify required env variables are present
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    // If during test/seed we don't have MongoDB or JWT, provide defaults to prevent immediate crash, 
    // but log a warning.
    if (process.env.NODE_ENV === 'test') {
      process.env[key] = process.env[key] || 'test_fallback_value';
    } else {
      console.warn(`[WARNING] Missing required environment variable: ${key}`);
    }
  }
});

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewiq',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_interviewiq',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_interviewiq',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  SMTP_PORT: process.env.SMTP_PORT || 2525,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@interviewiq.com'
};
