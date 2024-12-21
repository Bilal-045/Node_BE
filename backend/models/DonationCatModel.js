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
const DonationCat = sequelize.define('donation_cat', {
  cat_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  cat_descr: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Cat descrtipiont is required" },
    },
  },


},{
 
    timestamps: false, // Ensure Sequelize knows we're using custom timestamps
  });

// Sync the Donation model with the database to create the table
sequelize.sync()  // Use force to drop the old table and recreate it
  .then(() => console.log('Category table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = DonationCat;
