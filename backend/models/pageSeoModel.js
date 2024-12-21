const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance
const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
    host: 'localhost',
    dialect: 'mysql',
});

// Define the PageSeo model
const PageSeo = sequelize.define('page_seo', {
    seo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    page_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pages', // Name of the pages table
            key: 'pageid',
        },
    },
    meta_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    meta_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    meta_keywords: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    og_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    og_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    og_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    og_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    twitter_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    twitter_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    twitter_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    canonical_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    robots: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    structured_data: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    viewport_meta: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    breadcrumbs_json: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    social_profile_links: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    timestamps: false, // Disable createdAt and updatedAt columns
});

// Sync the model with the database
sequelize.sync()
    .then(() => console.log('PageSeo table created!'))
    .catch(err => console.log('Error: ' + err));

module.exports = PageSeo;
