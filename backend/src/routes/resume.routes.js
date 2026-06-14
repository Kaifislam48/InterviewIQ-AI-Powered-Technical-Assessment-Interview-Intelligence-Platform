const express = require('express');
const multer = require('multer');
const resumeController = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');
const { BadRequestError } = require('../utils/errors');

const router = express.Router();
router.use(protect);

// Setup multer memory storage with file type constraints
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'), false);
    }
  }
});

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.get('/history', resumeController.getHistory);
router.get('/latest', resumeController.getLatest);

module.exports = router;
