const { v4: uuidv4 } = require('uuid');
const { ChromaClient } = require('chromadb');
const openaiService = require('./openaiService');

const chroma = new ChromaClient({ baseUrl: 'http://127.0.0.1:8000' });
let collectionPromise = null;

// Use a single collection for all chunks, grouped by conversation_id in metadata
function getCollection() {
  if (!collectionPromise) {
    // Only specify the collection name, do not request embedding function/model
    collectionPromise = chroma.getOrCreateCollection({ name: 'chunks' });
  }
  return collectionPromise;
}

exports.chunkText = (text) => {
  // Simple chunking by 500 chars
  const size = 500;
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

exports.addChunk = async (file_id, chunk, embedding, conversation_id) => {
  const collection = await getCollection();
  // Always store conversation_id as string
  const meta = { file_id, conversation_id: String(conversation_id) };
  console.log('[addChunk] Adding chunk:', {
    file_id,
    chunk_preview: chunk.slice(0, 50),
    embedding_length: Array.isArray(embedding) ? embedding.length : null,
    conversation_id: String(conversation_id),
    meta
  });
  await collection.add({
    ids: [uuidv4()],
    embeddings: [embedding],
    documents: [chunk],
    metadatas: [meta]
  });
};

exports.similaritySearch = async (prompt, conversation_id, n = 5) => {
  console.log('--- similaritySearch called ---');
  console.log('Prompt:', prompt);
  console.log('Conversation ID:', conversation_id, 'Type:', typeof conversation_id);
  console.log('N Results:', n);
  let collection;
  try {
    collection = await getCollection();
    console.log('Chroma collection acquired.');
  } catch (err) {
    console.error('Error getting Chroma collection:', err);
    throw err;
  }
  let promptEmbedding;
  try {
    promptEmbedding = await openaiService.getEmbedding(prompt);
    console.log('Prompt embedding:', Array.isArray(promptEmbedding) ? `Array of length ${promptEmbedding.length}` : promptEmbedding);
  } catch (err) {
    console.error('Error getting embedding for prompt:', err);
    throw err;
  }
  if (!promptEmbedding || !Array.isArray(promptEmbedding)) {
    console.error('Failed to get embedding for prompt:', prompt, 'Result:', promptEmbedding);
    throw new Error('Failed to get embedding for prompt');
  }
  // Always query with conversation_id as string
  const where = { conversation_id: String(conversation_id) };
  let results;
  try {
    console.log('Querying ChromaDB with:', {
      queryEmbeddings: [promptEmbedding],
      nResults: n,
      where
    });
    results = await collection.query({
      queryEmbeddings: [promptEmbedding],
      nResults: n,
      where
    });
    console.log('ChromaDB query results:', {
      documents: results.documents,
      distances: results.distances,
      metadatas: results.metadatas
    });
  } catch (err) {
    console.error('Error querying ChromaDB:', err);
    throw err;
  }
  if (!results || !results.documents || !Array.isArray(results.documents) || results.documents.length === 0) {
    console.warn('No results returned from ChromaDB for prompt:', prompt, 'conversation_id:', conversation_id);
    return [];
  }
  // Return the most similar chunks as objects with chunk_text
  return (results.documents[0] || []).map((chunk_text, i) => ({
    chunk_text,
    score: results.distances && results.distances[0] ? results.distances[0][i] : null,
    metadata: results.metadatas && results.metadatas[0] ? results.metadatas[0][i] : null
  }));
};

// Debug utility: list all chunks in the collection
exports.listAllChunks = async () => {
  const collection = await getCollection();
  const count = await collection.count();
  console.log(`[listAllChunks] Collection has ${count} chunks.`);
  if (count === 0) return [];
  // ChromaDB collections can be paged; for debug, try to get all
  const results = await collection.get({
    include: ["documents", "metadatas", "ids"]
  });
  console.log('[listAllChunks] Example chunk:', results.documents && results.documents[0], results.metadatas && results.metadatas[0], results.ids && results.ids[0]);
  return results;
};
