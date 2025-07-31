const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversation_id: { type: DataTypes.INTEGER, allowNull: false },
  prompt: { type: DataTypes.TEXT },
  answer: { type: DataTypes.TEXT }
}, { timestamps: false });
