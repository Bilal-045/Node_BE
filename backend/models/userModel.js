const { Sequelize, DataTypes, Model } = require('sequelize');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = "4875475487AAAAA";
const JWT_EXPIRE = "15m";

const sequelize = new Sequelize('my_database', 'root', 'Oracle@12345', {
    host: 'localhost',
    dialect: 'mysql',
  });

class User extends Model {
  // Generate JWT token for user authentication
  getJWTToken() {
    return jwt.sign({ userid: this.userid }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
  }

  // Compare password
  async comparePassword(enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
  }

  // Generate password reset token
  getPasswordResetToken() {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
  }
}

User.init({

  userid: {
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
  },


  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name cannot be empty" },
      len: { args: [6, 30], msg: "Name must be between 5 and 30 characters" },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Email must be unique" },
    validate: {
      notEmpty: { msg: "Please enter an email" },
      isEmail: { msg: "Please enter a valid email" },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter phone number" }
    },
  },

  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "first Name cannot be empty" },
    },
  },

  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name cannot be empty" }
    },
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive'), // Enum for authorization type
    allowNull: false,                           // Authorization is required
    defaultValue: 'active',                     // Default value is 'active'
  },
  
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6], msg: "Password must be at least 8 characters" },
    },
  },


  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false,
  sequelize,
  hooks: {
    // Hash password before saving
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcryptjs.hash(user.password, 10);
      }
    },
  },
});

sequelize.sync() 
.then(() => console.log('User table created!')) 
.catch(err => console.log('Error: ' + err));
module.exports = User;
