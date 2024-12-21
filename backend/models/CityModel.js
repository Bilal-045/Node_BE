const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define the Cities model
const City = sequelize.define('city', {
  city_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Auto-increment primary key
  },
  city_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // Unique constraint for city names
    validate: {
      notEmpty: { msg: 'City name is required' }, // Ensure the field is not empty
    },
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt columns
});

sequelize.sync()
  .then(() => console.log('Cities table created!'))
  .catch(err => console.log('Error: ' + err));

// Export the model
module.exports = City;
