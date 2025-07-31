
const { Sequelize } = require('sequelize');
// Hardcoded DB URL (from .env):
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/smartqa', { dialect: 'postgres', logging: false });

const User = require('./user')(sequelize);
const Conversation = require('./conversation')(sequelize);
const File = require('./file')(sequelize);
const ExtractedChunk = require('./extractedChunk')(sequelize);
const Message = require('./message')(sequelize);
const Export = require('./export')(sequelize);

User.hasMany(Conversation, { foreignKey: 'user_id' });
Conversation.belongsTo(User, { foreignKey: 'user_id' });
Conversation.hasMany(File, { foreignKey: 'conversation_id' });
File.belongsTo(Conversation, { foreignKey: 'conversation_id' });
File.hasMany(ExtractedChunk, { foreignKey: 'file_id' });
ExtractedChunk.belongsTo(File, { foreignKey: 'file_id' });
Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });
Conversation.hasOne(Export, { foreignKey: 'conversation_id' });
Export.belongsTo(Conversation, { foreignKey: 'conversation_id' });

module.exports = { sequelize, User, Conversation, File, ExtractedChunk, Message, Export };
