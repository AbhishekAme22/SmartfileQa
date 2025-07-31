const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('file', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversation_id: { type: DataTypes.INTEGER, allowNull: false },
  file_name: { type: DataTypes.STRING },
  file_type: { type: DataTypes.STRING },
  file_url: { type: DataTypes.STRING },
  extracted_text: { type: DataTypes.TEXT }
}, { timestamps: false });
