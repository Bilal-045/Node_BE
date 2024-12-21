
const ErrorHandler = require('../utils/errorhandler');
const Synn=require('./asyncError');
const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const secretKey="4875475487AAAAA";



const isAuthenticatedUser=Synn(async (req,res,next)=>{
    const {token}=req.cookies;
    console.log("Token received:", token); // Debug log
    if(!token){
        return next(new ErrorHandler("please login to access this token",401))
    }
    const decodedData=jwt.verify(token,secretKey)

  req.user=  await User.findByPk(decodedData.userid)

  next();
})

const authorizeRoles= (...roles)=>{
   
return(req,res,next)=>{
    if(!roles.includes(req.user.roleid)){
     return next(new ErrorHandler("this user is not allowed ",403));
    }
    next();
}
}

module.exports={isAuthenticatedUser,authorizeRoles}
