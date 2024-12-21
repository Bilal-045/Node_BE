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

// Define the Payments model
const Payment = sequelize.define('payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Service type is required" },
    },
  },
  payment_method: {
    type: DataTypes.ENUM('online', 'cheque'),
    allowNull: false,
  },
  currency_type: {
    type: DataTypes.ENUM('USD', 'PKR', 'EUR', 'GBP'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  amount_pkr: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: "Invalid email" },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('inprocess', 'success', 'failed'),
    defaultValue: 'inprocess', // Default status
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.STRING, // For online payments, optional
    allowNull: true,
  },
  bank_response: {
    type: DataTypes.JSON, // Optional, for storing bank response
    allowNull: true,
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
  timestamps: true,  // Ensure Sequelize knows we're using custom timestamps
});

// Sync the Payment model with the database to create the table
sequelize.sync()
  .then(() => console.log('Payments table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = Payment;
