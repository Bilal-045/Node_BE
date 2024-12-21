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

// Define the Role_Mgmt_Details model
const RoleMgmtDetails = sequelize.define('role_mgmt_detail', {
    role_line_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-increment primary key
    },
    roleid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role_mgmt_headers', // Reference to the Role_Mgmt_header table
        key: 'roleid',             // Reference the roleid field in Role_Mgmt_header
      },
      validate: {
        notEmpty: { msg: "Role ID is required" }, // Ensure the field is not empty
      },
    },
    pageid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pages',  // Reference to the pages table
        key: 'pageid',   // Reference the pageid field in pages
      },
      validate: {
        notEmpty: { msg: "Page ID is required" }, // Ensure the field is not empty
      },
    },
    authorization: {
      type: DataTypes.ENUM('SEO', 'CONTENT'),  // Enum for authorization type
      allowNull: false,  // Authorization is required
    },
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1,  // Default is 1 (active)
    },
  }, {
    timestamps: false,  // Disable createdAt and updatedAt columns
  });

// Sync the Role_Mgmt_Details model with the database to create the table
sequelize.sync()
  .then(() => console.log('Role_Mgmt_Details table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = RoleMgmtDetails;
