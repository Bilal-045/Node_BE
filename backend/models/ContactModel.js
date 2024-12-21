const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
  host: 'localhost',
  dialect: 'mysql',
});

// Authenticate connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Define the Contact model
const Contact = sequelize.define('contact_form', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Full name is required" },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: "Valid email is required" },
      notEmpty: { msg: "Email is required" },
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: { msg: "Phone number should be numeric" },
    },
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  websiteUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "Invalid website URL" },
    },
  },
  service: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Message is required" },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Sync the Contact model with the database to create the table
sequelize.sync()
  .then(() => console.log('Contact table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = Contact;
