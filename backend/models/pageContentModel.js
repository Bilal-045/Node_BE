const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define the PageContent model
const PageContent = sequelize.define('page_content', {
    content_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pageid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pages', // Name of the pages table
            key: 'pageid',
        },
    },
    sec_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'page_sections', // Name of the page_sections table
            key: 'sec_id',
        },
    },
    short_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Short name is required" },
        },
    },
    item: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Item is required" },
        },
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Content is required" },
        },
    },
    page_image: {
        type: DataTypes.STRING, // Store URL or image path here
        allowNull: true,
      },
      img_alt_tag: {
        type: DataTypes.STRING, // Store URL or image path here
        allowNull: true,
      },
}, {
    timestamps: false, // Disable createdAt and updatedAt columns
});

// Sync the model with the database
sequelize.sync()
    .then(() => console.log('PageContent table created!'))
    .catch(err => console.log('Error: ' + err));

module.exports = PageContent;
