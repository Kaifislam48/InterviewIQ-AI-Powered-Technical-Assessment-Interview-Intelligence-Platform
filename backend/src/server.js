const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.message, { stack: err.stack });
  process.exit(1);
});

// Connect Database
connectDB();

// Start Server
const server = app.listen(env.PORT, () => {
  logger.info(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  logger.error(err.message, { stack: err.stack });
  server.close(() => {
    process.exit(1);
  });
});
