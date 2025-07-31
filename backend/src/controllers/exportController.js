const exportService = require('../services/exportService');

exports.handleExport = async (req, res) => {
  try {
    const { conversation_id, email } = req.body;
    const result = await exportService.exportConversation(conversation_id, email);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
