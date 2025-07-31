const { Message, File, ExtractedChunk } = require('../models');
const chromaService = require('./chromaService');
const openaiService = require('./openaiService');

exports.answerPrompt = async (conversation_id, prompt) => {
  // 1. Get all file_ids for this conversation
  const files = await File.findAll({ where: { conversation_id } });
  const fileIds = files.map(f => f.id);
  // 2. Get all chunks for these files (not needed for ChromaDB search, but kept for fallback)
  // const chunks = await ExtractedChunk.findAll({ where: { file_id: fileIds } });
  // 3. Search ChromaDB for relevant chunks
  const relevantChunks = await chromaService.similaritySearch(prompt, conversation_id);
  // 4. Compose context
  const context = relevantChunks.map(c => c.chunk_text).join('\n');
  // 5. Get answer from OpenAI
  const answer = await openaiService.getCompletion(context, prompt);
  // 6. Save message
  await Message.create({ conversation_id, prompt, answer });
  return answer;
};
