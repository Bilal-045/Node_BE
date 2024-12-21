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

// Define the Blog model
const Blog = sequelize.define('allBlog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Title is required" },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter blog description" },
    },
  },
  image: {
    type: DataTypes.STRING, // Store URL or image path here
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT('long'), // Use TEXT or TEXT('long') for large content
    allowNull: true,
  
  },
  blogType: {
    type: DataTypes.TEXT, // Use TEXT or TEXT('long') for large content
    allowNull: true,
  },
blogStatus: {
  type: DataTypes.TEXT,
  allowNull: true,
},

  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true,
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

// Sync the Blog model with the database to create the table
sequelize.sync()
  .then(() => console.log('Blog table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = Blog;
