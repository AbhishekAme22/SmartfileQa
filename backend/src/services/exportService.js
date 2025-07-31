const { Conversation, Message, File, Export } = require('../models');
const pdfService = require('./pdfService');
const emailService = require('./emailService');

exports.exportConversation = async (conversation_id, email) => {
  // 1. Fetch all data
  const conversation = await Conversation.findByPk(conversation_id, { include: [Message, File] });
  // 2. Generate PDF
  const pdf_url = await pdfService.generatePDF(conversation);
  // 3. Save export record
  await Export.create({ conversation_id, pdf_url, sent_to: email });
  // 4. Email PDF
  await emailService.sendEmailWithPDF(email, pdf_url);
  return { success: true, pdf_url };
};
