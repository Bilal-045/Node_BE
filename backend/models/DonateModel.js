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

// Define the Donations model
const Donation = sequelize.define('donation', {
  donate_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  donate_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Donate type is required" },
    },
  },
  donate_title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Donate title is required" },
    },
  },
  donate_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  donate_img: {
    type: DataTypes.STRING, // URL or image path here
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'inActive', // Default status
    allowNull: false,
  },
  cat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'donation_cats', // Name of the referenced table
      key: 'cat_id', // Name of the referenced column
    },
    onUpdate: 'CASCADE', // Automatically update cat_id if it changes in the parent table
    onDelete: 'CASCADE', // Delete donation if the associated category is deleted
  },
  target: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  collected: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0, // Default value for collected amount
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW, // Automatically updates on record modification
  },
}, {
  // Set custom column names for the timestamps
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true, // Ensure Sequelize knows we're using custom timestamps
});

// Sync the models with the database
sequelize.sync()
  .then(() => console.log('Donations table created with new columns!'))
  .catch(err => console.log('Error: ' + err));

module.exports = Donation;
