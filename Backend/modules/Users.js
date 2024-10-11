const mongoose = require('mongoose');
const creteUser = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true

    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true

    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    confirmpass:{
        type:String,
        // required:true,
        trim:true
    },
    accountType:{
        type:String,
        required:true,
        enum : ["Admin","Student","Instructor"]
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
    }],
    cources:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date
    },
    image:{
        type:String,
        required:true
    },
    courceProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProgress"
    }]
},{timeStamps :true});
module.exports  =mongoose.model("user",creteUser) 