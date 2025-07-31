const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('extracted_chunk', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  file_id: { type: DataTypes.INTEGER, allowNull: false },
  chunk_text: { type: DataTypes.TEXT },
  embedding: { type: DataTypes.JSONB }
}, { timestamps: false });
