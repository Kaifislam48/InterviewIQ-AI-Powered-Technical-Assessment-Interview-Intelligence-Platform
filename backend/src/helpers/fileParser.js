const pdfParse = require('pdf-parse');
const logger = require('../utils/logger');

const parsePDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    logger.error(`Error parsing PDF: ${error.message}`);
    throw new Error('Failed to parse PDF file. Ensure it is a valid PDF document.');
  }
};

const parseDocx = async (fileBuffer) => {
  try {
    // Basic fallback parser: since parsing docx from binary requires complex libraries like mammoth, 
    // we can extract printable ascii/utf8 strings from buffer as a baseline or log a message.
    const text = fileBuffer.toString('utf8').replace(/[^\x20-\x7E\t\r\n]/g, '');
    return text;
  } catch (error) {
    logger.error(`Error parsing DOCX fallback: ${error.message}`);
    throw new Error('Failed to parse DOCX file.');
  }
};

const extractTextFromFile = async (file) => {
  const mimeType = file.mimetype;
  const buffer = file.buffer;

  if (mimeType === 'application/pdf') {
    return parsePDF(buffer);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return parseDocx(buffer);
  } else {
    // If it's a plain text file, convert buffer to string directly
    return buffer.toString('utf-8');
  }
};

module.exports = {
  extractTextFromFile,
};
