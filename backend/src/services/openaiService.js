
const { OpenAI } = require('openai');
// Hardcoded OpenAI API key
const openai = new OpenAI({ apiKey: 'your api key' });

exports.getEmbedding = async (text) => {
  // Call OpenAI embedding API (v4+)
  try {
    const resp = await openai.embeddings.create({ model: 'text-embedding-ada-002', input: text });
    const embedding = resp.data[0]?.embedding;
    console.log('OpenAI embedding response:', resp.data);
    console.log('Extracted embedding:', embedding, 'Type:', typeof embedding, 'IsArray:', Array.isArray(embedding));
    return embedding;
  } catch (err) {
    console.error('Error getting embedding from OpenAI:', err);
    return undefined;
  }
};

exports.getCompletion = async (context, prompt) => {
  // Call OpenAI chat completion API (v4+)
  const resp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `${context}\n${prompt}` }
    ]
  });
  return resp.choices[0].message.content;
};
