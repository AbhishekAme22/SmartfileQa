const { File, ExtractedChunk } = require('../models');
const { extractTextFromFile } = require('../utils/fileParsers');
const chromaService = require('./chromaService');
const openaiService = require('./openaiService');
const bucket = require('../utils/firebase');
const path = require('path');

exports.processUpload = async (file, email, conversation_id) => {
  const { Conversation, User } = require('../models');
  let convId = conversation_id;
  // If conversation_id is not provided or not found, create a new conversation
  if (!convId) {
    // Find or create user by email
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ email });
    }
    const conversation = await Conversation.create({ user_id: user.id, title: `Conversation for ${email}` });
    convId = conversation.id;
  } else {
    // Check if conversation exists
    const conversation = await Conversation.findByPk(convId);
    if (!conversation) {
      // Find or create user by email
      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({ email });
      }
      const newConv = await Conversation.create({ user_id: user.id, title: `Conversation for ${email}` });
      convId = newConv.id;
    }
  }
  // 1. Extract text
  const extracted_text = await extractTextFromFile(file);

  // 2. Upload file to Firebase Storage
  const destFileName = `${Date.now()}_${file.originalname}`;
  const uploadRes = await bucket.upload(file.path, {
    destination: destFileName,
    public: true,
    metadata: { contentType: file.mimetype }
  });
  // Get public URL
  const firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${destFileName}`;

  // 3. Save file metadata and text
  const dbFile = await File.create({
    conversation_id: convId,
    file_name: file.originalname,
    file_type: file.mimetype,
    file_url: firebaseUrl,
    extracted_text
  });
  // 3. Chunk and embed
  const chunks = chromaService.chunkText(extracted_text);
  for (const chunk of chunks) {
    const embedding = await openaiService.getEmbedding(chunk);
    await ExtractedChunk.create({ file_id: dbFile.id, chunk_text: chunk, embedding });
    await chromaService.addChunk(dbFile.id, chunk, embedding, convId);
  }
  return { success: true, file_id: dbFile.id, conversation_id: convId , url: firebaseUrl };
};
