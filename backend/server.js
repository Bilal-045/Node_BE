const app=require('./App')
const conectDatabase=require('./config/database')
const dotenv=require('dotenv')
require('dotenv').config();

//const cloudinary=require("cloudinary");
//handling uncauhgt exception error
process.on("uncaughtException",(error)=>{
    console.log("it is an  error ");
    process.exit(1);
})
const { sequelize } = require('./models/blogModel');

sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });


dotenv.config({path:"backend/config/config.env"})

conectDatabase();
const server=app.listen(4000,()=>{
    console.log('server is fine and perfect at port '+ 4000)
})
/*
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
})
*/

//promise rejection

process.on("unhandledRejection",err=>{
    console.log(`error `)
    console.log("down now" )
    server.close(()=>{
        process.exit(1);
    })
})