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

// Define the page model
const Page = sequelize.define('page', {
    pageid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    page_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title is required" },
      },
    },
    page_type: {
      type: DataTypes.ENUM('mainpage', 'subpage'),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter page type" },
      },
    },
  }, {
    timestamps: false,  // Disable createdAt and updatedAt columns
  });
  

// Sync the Blog model with the database to create the table
sequelize.sync()
  .then(() => console.log('Page table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = Page;
