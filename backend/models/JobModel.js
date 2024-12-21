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
const Job = sequelize.define('job', {
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
      notEmpty: { msg: "Please enter job description" },
    },
  },
  jobType: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter job type" },
    },
  },

  jobLocation: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter job location" },
    },
  },


  jobGoogleLink: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter url" },
    },
  },
  

  status: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: "status" },
    },
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
  .then(() => console.log('Job table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = Job;
