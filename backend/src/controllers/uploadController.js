const fileService = require('../services/fileService');

exports.handleUpload = async (req, res) => {
  try {
    const { email, conversation_id } = req.body;
    const file = req.file;
    const result = await fileService.processUpload(file, email, conversation_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
