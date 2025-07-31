const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const textract = require('textract');
const fs = require('fs');
const util = require('util');
const textractAsync = util.promisify(textract.fromFileWithPath);

const Tesseract = require('tesseract.js');

exports.extractTextFromFile = async (file) => {
  if (file.mimetype === 'application/pdf') {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value;
  } else if (file.mimetype === 'text/plain') {
    // Directly read text files
    return fs.readFileSync(file.path, 'utf8');
  } else if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/bmp' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/tiff'
  ) {
    // OCR for images
    try {
      const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
      const wrapped = `User has provided an image. The text inside the image is as follows:\n\n"""\n${text.trim()}\n"""\n`;
      return wrapped;
    } catch (err) {
      console.error('Tesseract OCR failed:', err);
      throw err;
    }
  } else {
    // fallback to textract for other types
    return await textractAsync(file.path);
  }
};
