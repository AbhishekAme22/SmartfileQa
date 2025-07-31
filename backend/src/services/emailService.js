const nodemailer = require('nodemailer');
const fs = require('fs');

exports.sendEmailWithPDF = async (to, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'your email', pass: 'app password' }, // App password for SmartFile
    tls: { rejectUnauthorized: false }
  });
  await transporter.sendMail({
    from: 'your email',
    to,
    subject: 'Your Conversation PDF',
    text: 'Attached is your exported conversation.',
    attachments: [{ filename: 'conversation.pdf', path: pdfPath }]
  });
};
