const ErrorHandler = require('../utils/errorhandler');
const Synn = require('../middleware/asyncError');
const User = require('../models/userModel'); // This should be your Sequelize model
const sendToken = require('../utils/jwtToken');
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const { Sequelize } = require('sequelize');



const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
    host: 'localhost',
    dialect: 'mysql',
  });

// Register a user
exports.registerUser = Synn(async (req, res, next) => {
    const { user_name, email, password,roleid,first_name,last_name
        ,phone,status,dob
     } = req.body;

    if (!email || !password|| !user_name) {
        return next(new ErrorHandler("Please enter name,email and password", 400));
    }

    try {
    
        const user = await User.create({
            user_name, email, password,roleid,first_name,last_name
            ,phone,status,dob
        });
        res.status(201).json({ message: "user created successfully", data: user });
      } catch (error) {

        console.error('Error adding job:', error);
        res.status(500).json({ message: error });
      }
});

// Login user
exports.loginUser = Synn(async (req, res, next) => {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
        return next(new ErrorHandler("Please enter both email and password", 400));
    }

    try{
        const user = await User.findOne({ where: { user_name }, attributes: ['userid', 'user_name', 
            'email', 'password', 'roleid'] });

            const isPasswordMatched = await user.comparePassword(password)

            if (!isPasswordMatched) {
                return next(new ErrorHandler("we cannot find user with this details", 401))
            }

            sendToken(user, 200, res);
    }
    catch(error){
        //console.error('Error adding job:', error);
        res.status(500).json({ message: error });

    }
    

  
        

   
});

// Logout user
exports.logoutUser = Synn(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: "Logged out successfully." });
});

// Forgot password
exports.forgotPassword = Synn(async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
        return next(new ErrorHandler("User does not exist", 404));
    }

    const resetToken = user.getPasswordresetToken();
    await user.save();

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is: \n\n ${resetPasswordUrl}\n\nIf you have not requested this, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Recovery",
            message
        });
        res.status(200).json({ success: true, message: `Email sent to ${user.email} successfully` });
    } catch (error) {
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();
        return next(new ErrorHandler("Email could not be sent", 500));
    }
});

// Reset password
exports.resetPassword = Synn(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        where: {
            resetPasswordToken,
            resetPasswordExpire: { [Op.gt]: Date.now() }
        }
    });

    if (!user) {
        return next(new ErrorHandler("Token is invalid or has expired", 404));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    sendToken(user, 200, res);
});

// Get user details
// Get user details along with role_name
// Get user details along with role_name
exports.getUserDetails = async (req, res, next) => {
    try {
        const userId = req.user.userid; // Extracted from isAuthenticatedUser middleware

        const userDetails = await sequelize.query(
            `SELECT 
                u.userid, 
                u.user_name, 
                u.email, 
                u.phone, 
                u.first_name, 
                u.last_name, 
                u.status, 
                u.dob, 
                u.roleid, 
                r.role_name 
            FROM 
                users u 
            INNER JOIN 
                role_mgmt_headers r 
            ON 
                u.roleid = r.roleid 
            WHERE 
                u.userid = :userId`, // Use parameterized queries for security
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: { userId }, // Pass parameters securely
            }
        );

        if (!userDetails || userDetails.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user: userDetails[0] });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ success: false, message: "Unable to fetch user details" });
    }
};


// Update user details
exports.updateUserDetails = Synn(async (req, res, next) => {
    const user = await User.findByPk(req.user.id);
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({ success: true, user });
});

// Update user profile
exports.updateUserProfile = Synn(async (req, res, next) => {
    const newUserData = {
        user_name: req.body.user_name,
        email: req.body.email,
        roleid: req.body.roleid,
        password: req.body.password,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        dob : req.body.dob,
        phone: req.body.phone
    };

    await User.update(newUserData, { where: { userid: req.user.id } });

    res.status(200).json({ success: true });
});

exports.findAllUsers = async (req, res, next) => {
    try {
        // Replace `sequelize` with your Sequelize instance name
        const users = await sequelize.query(
            `SELECT 
                u.userid, 
                u.user_name, 
                u.email, 
                u.phone, 
                u.first_name, 
                u.last_name, 
                u.status, 
                u.dob, 
                u.roleid, 
                r.role_name 
            FROM 
                users u 
            INNER JOIN 
                role_mgmt_headers r 
            ON 
                u.roleid = r.roleid`,
            { type: Sequelize.QueryTypes.SELECT } // Query type for SELECT
        );
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Unable to fetch users" });
    }
};

// Admin - Get user details
exports.findAllUsersAdmin = Synn(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ success: true, user });
});

// Admin - Update user role
exports.updateUserRole = Synn(async (req, res, next) => {
    const newUserData = {
        user_name: req.body.user_name,
        email: req.body.email,
        roleid: req.body.roleid,
        first_name :req.body.first_name,
        last_name : req.body.last_name,
        phone : req.body.phone,
        dob : req.body.dob
    };

    const user = await User.update(newUserData, { where: { userid: req.params.id } });

    res.status(200).json({ success: true, user });
});

// Admin - Delete user profile
exports.deleteUserProfile = Synn(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    await user.destroy();
    res.status(200).json({ success: true, message: "User deleted successfully" });
});
