
const mongoose = require('mongoose');
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    } ,
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*5
    }
});



OTPSchema.pre("save", (next)=>{
    if(this.isNew){
        console.log("The otp email before SAVING IT ",this.email)
        console.log("The otp before SAVING IT ",this.otp)
        // await sendVerification(this.email,this.otp)
    }
    next()
})
const OTP = mongoose.model("OTP",OTPSchema);
module.exports = OTP;

