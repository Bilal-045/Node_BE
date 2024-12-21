const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define the PageSection model
const PageSection = sequelize.define('page_section', {
  sec_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Auto-increment for unique identifiers
  },
  pageid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pages', // Name of the referenced table
      key: 'pageid',  // Name of the referenced column
    },
    onDelete: 'CASCADE', // Delete sections if the associated page is deleted
  },
  section_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Section name is required" },
    },
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt columns
});

// Sync the PageSection model with the database to create the table
sequelize.sync()
  .then(() => console.log('PageSections table created!'))
  .catch(err => console.log('Error: ' + err));

module.exports = PageSection;
