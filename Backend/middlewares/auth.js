const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require('../modules/Users')
exports.auth = async (req,res) => {
    try {
        const token = req.cookies.token || req.body.token || req.headers("Authorisation").replace("Bearer"," ");
        const decode = await jwt.verify(token,process.env.JWT_SECRET) ;
        console.log(decode);
        req.User = decode    
    } catch (error) {
        console.log("Error in the code");
        console.log(error)
    }
}


exports.isStudent = async (req,res,next) => {
    try{
        if(req.User.accountType !== "Student"){
            res.status(400).json({
                success:false,
                message:"YOu are not allowed to Enter this route"
            })
        }
        next()
    }catch(error){
        console.log("Error in the code");
        console.log(error)
    }
}

exports.isAdmin = async (req,res,next) => {
    try{
        if(req.User.accountType !== "Admin"){
            res.status(400).json({
                success:false,
                message:"YOu are not allowed to Enter this route"
            })
        }
        next()
    }catch(error){
        console.log("Error in the code");
        console.log(error)
    }
}

exports.isInstructor = async (req,res,next) => {
    try{
        if(req.User.accountType !== "Instructor"){
            res.status(400).json({
                success:false,
                message:"YOu are not allowed to Enter this route"
            })
        }
        next()
    }catch(error){
        console.log("Error in the code");
        console.log(error)
    }
}