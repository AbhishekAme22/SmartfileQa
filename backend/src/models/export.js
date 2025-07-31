const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('export', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversation_id: { type: DataTypes.INTEGER, allowNull: false },
  pdf_url: { type: DataTypes.STRING },
  sent_to: { type: DataTypes.STRING }
}, { timestamps: false });
