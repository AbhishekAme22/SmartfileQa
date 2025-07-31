const qaService = require('../services/qaService');

exports.handleAsk = async (req, res) => {
  try {
    const { conversation_id, prompt } = req.body;
    const answer = await qaService.answerPrompt(conversation_id, prompt);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
