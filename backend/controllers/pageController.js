const Page = require('../models/pageModel'); // Adjust path if needed

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
  host: 'localhost',
  dialect: 'mysql',
});


// Controller to retrieve all blog posts
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll();
    res.status(200).json({ message: "page retrieved successfully", data: pages });
  } catch (error) {
    console.error('Error retrieving page:', error);
    res.status(500).json({ message: "Error retrieving jobs", error });
  }
};




// Controller to retrieve pages based on user ID for content
exports.getPagesByUserId = async (req, res) => {
  const userId = req.params.id; // Extract user ID from the URL

  try {
    // Execute the raw SQL query
    const pages = await sequelize.query(
      `
      SELECT p.page_name, p.pageid
      FROM users u
      JOIN role_mgmt_headers r ON u.roleid = r.roleid
      JOIN role_mgmt_details rmd ON r.roleid = rmd.roleid
      JOIN pages p ON rmd.pageid = p.pageid
      WHERE u.userid = :userId
        AND rmd.authorization = 'CONTENT'
        AND rmd.active = 1
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { userId }, // Prevent SQL injection by using replacements
      }
    );


    

    // Check if any pages were found
    if (pages.length === 0) {
      return res.status(404).json({ message: "No pages found for this user." });
    }

    res.status(200).json({ message: "Pages retrieved successfully", data: pages });
  } catch (error) {
    console.error('Error retrieving pages:', error);
    res.status(500).json({ message: "Error retrieving pages", error });
  }
};





// Controller to retrieve pages based on user ID for SEO
exports.getPagesSeoByUserId = async (req, res) => {
  const userId = req.params.id; // Extract user ID from the URL

  try {
    // Execute the raw SQL query
    const pages = await sequelize.query(
      `
      SELECT p.page_name, p.pageid
      FROM users u
      JOIN role_mgmt_headers r ON u.roleid = r.roleid
      JOIN role_mgmt_details rmd ON r.roleid = rmd.roleid
      JOIN pages p ON rmd.pageid = p.pageid
      WHERE u.userid = :userId
        AND rmd.authorization = 'SEO'
        AND rmd.active = 1
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { userId }, // Prevent SQL injection by using replacements
      }
    );


    

    // Check if any pages were found
    if (pages.length === 0) {
      return res.status(404).json({ message: "No pages found for this user." });
    }

    res.status(200).json({ message: "Pages retrieved successfully", data: pages });
  } catch (error) {
    console.error('Error retrieving pages:', error);
    res.status(500).json({ message: "Error retrieving pages", error });
  }
};