const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
  host: 'localhost',
  dialect: 'mysql',
});

// Authenticate the connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Define the website_media model
const WebsiteMedia = sequelize.define('website_media', {
  media_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  media_type: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  media_creation_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  media_content: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active',
  },
  media_thumnail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  media_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  media_description: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt columns
});

// Sync the WebsiteMedia model with the database to create the table
sequelize.sync()
  .then(() => console.log('WebsiteMedia table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = WebsiteMedia;
