
const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
  host: 'localhost',
  dialect: 'mysql',
});



const Branch = sequelize.define('branch', {
    branch_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-increment primary key
    },
    branch_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Branch name is required' }, // Ensure the field is not empty
      },
    },
    branch_description: {
      type: DataTypes.TEXT, // Allow long text for branch description
    },
    branch_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Branch address is required' }, // Ensure the field is not empty
      },
    },
    branch_google_map_link: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: { msg: 'Must be a valid URL' }, // Validate for proper URL format
      },
    },
    branch_phone: {
      type: DataTypes.STRING(20),
      validate: {
        isNumeric: { msg: 'Phone number must contain only numbers' }, // Ensure the phone is numeric
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cities', // Reference to the Cities table
        key: 'city_id',  // Reference the city_id field in Cities
      },
      validate: {
        notEmpty: { msg: 'City ID is required' }, // Ensure the field is not empty
      },
    },
  }, {
    timestamps: false, // Disable createdAt and updatedAt columns
  });

  sequelize.sync()
  .then(() => console.log('Cities table created!'))
  .catch(err => console.log('Error: ' + err));
  
  // Export the model
  module.exports = Branch;
  