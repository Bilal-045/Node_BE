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

// Define the Role_Mgmt_header model
const RoleMgmtHeader = sequelize.define('role_mgmt_header', {
    roleid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-increment primary key
    },
    role_name: {
      type: DataTypes.STRING(50), // 50 characters for role name
      allowNull: false, // Role name is required
      validate: {
        notEmpty: { msg: "Role name is required" }, // Ensure the field is not empty
      },
    },
    role_description: {
      type: DataTypes.STRING(500), // 500 characters for role description
      allowNull: false, // Role description is required
      validate: {
        notEmpty: { msg: "Role description is required" }, // Ensure the field is not empty
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'), // Enum for status
      defaultValue: 'active', // Default status is 'active'
    },
  }, {
    timestamps: false,  // Disable createdAt and updatedAt columns
  });

// Sync the Role_Mgmt_header model with the database to create the table
sequelize.sync()
  .then(() => console.log('Role_Mgmt_header table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = RoleMgmtHeader;
