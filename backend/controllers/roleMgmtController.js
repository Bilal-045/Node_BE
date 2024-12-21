const RoleMgmtHeader = require('../models/RoleHeaderModel'); // Adjust path as needed
const RoleMgmtDetails = require('../models/RoleMgmtDetailModel'); // Adjust path as needed
const ErrorHandler = require('../utils/errorhandler');  // Assuming you have an error handler utility
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
  host: 'localhost',
  dialect: 'mysql',
});
// Controller to add a new role (Role_Mgmt_header)
exports.addRole = async (req, res) => {
  const { role_name, role_description, status } = req.body;

  // Validate input
  if (!role_name || !role_description) {
    return res.status(400).json({ message: "Role name and role description are required" });
  }

  try {
    const newRole = await RoleMgmtHeader.create({
      role_name,
      role_description,
      status,
    });

    res.status(201).json({ message: "Role created successfully", data: newRole });
  } catch (error) {
    console.error('Error adding role:', error);
    res.status(500).json({ message: "Error adding role, try some unique role name" });
  }
};

//function to retrieve all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleMgmtHeader.findAll();
    res.status(200).json({ message: "Roles retrieved successfully", data: roles });
  } catch (error) {
    console.error('Error retrieving roles:', error);
    res.status(500).json({ message: "Error retrieving jobs", error });
  }
};

// Controller to delete a role (Role_Mgmt_header)
exports.deleteRole = async (req, res, next) => {
  try {
    const role = await RoleMgmtHeader.findByPk(req.params.id);

    if (!role) {
      return next(new ErrorHandler("Role not found", 404));
    }

    await role.destroy();

    res.status(200).json({
      success: true,
      message: "Role deleted permanently",
    });

    console.log("Deleted role:", role);
  } catch (error) {
    console.error("Error deleting role:", error);
    next(error);
  }
};

// Controller to update a role (Role_Mgmt_header)
exports.updateRole = async (req, res, next) => {
  const { role_name, role_description, status } = req.body;

  try {
    const role = await RoleMgmtHeader.findByPk(req.params.id);

    if (!role) {
      return next(new ErrorHandler("Role not found", 404));
    }

    role.role_name = role_name || role.role_name;
    role.role_description = role_description || role.role_description;
    role.status = status || role.status;

    await role.save();

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });

    console.log("Updated role:", role);
  } catch (error) {
    console.error("Error updating role:", error);
    next(error);
  }
};

// Controller to get a role by ID (Role_Mgmt_header)
exports.getRoleById = async (req, res, next) => {
  try {
    const role = await RoleMgmtHeader.findByPk(req.params.id);

    if (!role) {
      return next(new ErrorHandler("Role not found", 404));
    }

    res.status(200).json({
      success: true,
      data: role,
    });

  } catch (error) {
    console.error("Error fetching role:", error);
    next(error);
  }
};

// Controller to add a new role detail (Role_Mgmt_Details)
exports.addRoleDetail = async (req, res) => {
  const { roleid, pageid, authorization, active } = req.body;

  // Validate input
  if (!roleid || !pageid || !authorization) {
    return res.status(400).json({ message: "Role ID, Page ID, and Authorization are required" });
  }

  try {
    const newRoleDetail = await RoleMgmtDetails.create({
      roleid,
      pageid,
      authorization,
      active,
    });

    res.status(201).json({ message: "Role detail created successfully", data: newRoleDetail });
  } catch (error) {
    console.error('Error adding role detail:', error);
    res.status(500).json({ message: error });
  }
};

// Controller to delete a role detail (Role_Mgmt_Details)
exports.deleteRoleDetail = async (req, res, next) => {

  try {
    const roleDetail = await RoleMgmtDetails.findByPk(req.params.id);
    console.log(roleDetail)
    if (!roleDetail) {
      return next(new ErrorHandler("Role detail not found", 404));
    }

    await roleDetail.destroy();

    res.status(200).json({
      success: true,
      message: "Role detail deleted permanently",
    });

    console.log("Deleted role detail:", roleDetail);
  } catch (error) {
    console.error("Error deleting role detail:", error);
    next(error);
  }
};

// Controller to update a role detail (Role_Mgmt_Details)
exports.updateRoleDetail = async (req, res, next) => {
  const { roleid, pageid, authorization, active } = req.body;

  try {
    const roleDetail = await RoleMgmtDetails.findByPk(req.params.id);

    if (!roleDetail) {
      return next(new ErrorHandler("Role detail not found", 404));
    }

    roleDetail.roleid = roleid || roleDetail.roleid;
    roleDetail.pageid = pageid || roleDetail.pageid;
    roleDetail.authorization = authorization || roleDetail.authorization;
    roleDetail.active = active !== undefined ? active : roleDetail.active;

    await roleDetail.save();

    res.status(200).json({
      success: true,
      message: "Role detail updated successfully",
      data: roleDetail,
    });

    console.log("Updated role detail:", roleDetail);
  } catch (error) {
    console.error("Error updating role detail:", error);
    next(error);
  }
};

// Controller to get a role detail by ID (Role_Mgmt_Details)
exports.getRoleDetailById = async (req, res, next) => {
  try {
    const roleDetail = await RoleMgmtDetails.findByPk(req.params.id);

    if (!roleDetail) {
      return next(new ErrorHandler("Role detail not found", 404));
    }

    res.status(200).json({
      success: true,
      data: roleDetail,
    });

  } catch (error) {
    console.error("Error fetching role detail:", error);
    next(error);
  }
};


exports.getAllPermissions = async (req, res) => {
  try {
    const { id } = req.params; // Extract roleid from the URL params

    const permissions = await sequelize.query(
      `SELECT 
          rmd.role_line_id, 
          rmd.roleid, 
          rh.role_name, 
          rmd.pageid, 
          p.page_name, 
          rmd.authorization, 
          rmd.active 
       FROM role_mgmt_details rmd
       INNER JOIN role_mgmt_headers rh ON rmd.roleid = rh.roleid
       INNER JOIN pages p ON rmd.pageid = p.pageid
       WHERE rmd.roleid = :roleid`, // Add condition for roleid
      {
        replacements: { roleid: id }, // Pass the roleid as a parameter
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "Permissions retrieved successfully",
      data: permissions,
    });
  } catch (error) {
    console.error('Error retrieving permissions:', error);
    res.status(500).json({ message: "Error retrieving permissions", error });
  }
};

