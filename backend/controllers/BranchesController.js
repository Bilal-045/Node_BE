const CityModel = require('../models/CityModel'); // Adjust path as needed
const BranchModel = require('../models/BranchModel'); // Adjust path as needed
const ErrorHandler = require('../utils/errorhandler');  // Assuming you have an error handler utility
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
  host: 'localhost',
  dialect: 'mysql',
});


//function to retrieve all roles
exports.getAllCities = async (req, res) => {
  try {
    const cities = await CityModel.findAll();
    res.status(200).json({ message: "Cities retrieved successfully", data: cities });
  } catch (error) {
    console.error('Error retrieving cities:', error);
    res.status(500).json({ message: "Error retrieving cities", error });
  }
};







exports.getAllBranchesByCity = async (req, res) => {
  try {
    const { id } = req.params; // Extract roleid from the URL params

    const permissions = await sequelize.query(
      `SELECT 
    b.branch_id,
    b.branch_name,
    b.branch_description,
    b.branch_address,
    b.branch_google_map_link,
    b.branch_phone
FROM 
    branches b where
b.city_id = :city_id;
`, // Add condition for roleid
      {
        replacements: { city_id : id }, // Pass the roleid as a parameter
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "Branches retrieved successfully",
      data: permissions,
    });
  } catch (error) {
    console.error('Error retrieving branches:', error);
    res.status(500).json({ message: "Error retrieving branches", error });
  }
};

