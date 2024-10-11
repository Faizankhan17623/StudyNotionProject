const bcrypt = require('bcrypt');
const User  = require('../modules/Users');
const OTP = require('../modules/OTp');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/nodemailer');
const passwordUpdated = require('../mail/templates/passwordUpdate');
const otpTemplate = require('../mail/templates/emailVerificationTemplate')
const Profile = require('../modules/Profile');
require('dotenv').config();

exports.Signup = async(req,res)=>{
    try {
        const {firstname,lastname,email,password,confirmpass,accountType,otp,contactNumber} = req.body;
        if(!firstname || !lastname || !email || !password || !confirmpass || !accountType || !otp || !contactNumber){
            return res.status(403).json({
            success:false,
            message:"All The Fields are required"
            })
        }


        if(password !== confirmpass){
            return res.status(400).json({
                success:false,
                message:"Both the passwords do not mathc"
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"The user is alread present please Login "
            })
        }


        const response = await OTP.find({email}).sort({createAt : -1}).limit(1);
        console.log(response)
        if(response.length === 0){
            return res.status(400).json({
                success:false,
                message:"The Otp is not valid"
            })
        }else if(otp !== response[0].otp){
            return res.status(400).json({
                success:false,
                message:"The otp is not valid"
            })
        }

        const HahedPassword = await bcrypt.hash(password,12);
        let approved = "";
        approved === "Instructor"?(approved = false):(approved=true);

        const profileDetails = await Profile.create({
            gender:null,
            dateofbirth:null,
            about:null,
            contactNumber:null
        })

        const user = await User.create({
            firstname,
            lastname,
            email,
            contactNumber,
            password:HahedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`
        })
        console.log(user)
        return res.status(200).json({
            success:true,
            message:"The User is Been registered"
        })
    } catch (error) {
        console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
    }
}


exports.Login = async(req,res)=>{
    try {
        const{email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Both the Fields area required"
            })
        }

        const user = await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(400).json({
                success:false,
                message:"The user is not  present  please Sign un"
            })
        }
        if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign(
                {email:user.email , id:user._id,accountType:user.accountType},
                process.env.JWT_SECRET,
                {
                    expiresIn:"24h"
                }
            )
            console.log("the jwt token is",token)
            user.token = token
            user.password = undefined;
            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"user Loged in "
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Password is not Correct"
            })
        }


    } catch (error) {
        console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
    }
}



exports.SendOtp = async (req,res) => {
    try {
        const {email} = req.body

        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User is Already registered"
            })
        }

        let otp  = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("otp is",otp)
        const result  = await OTP.findOne({otp:otp});
        console.log("The result is ",result)

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
            })
        }
        const otpPayload = {email,otp}
        const SendOTpEmail = await mailSender(otpPayload.email,"the otp is ",otpTemplate(otpPayload.otp))
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody); 
        res.status(200).json({
            success:true,
            message:"otp send Succesfully"
        })
    } catch (error) {
        console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
    }
}


exports.changePassword = async (req,res) => {
    try {

        const head = req.header.Authorisation;
        console.log(head)
        console.log("The password changing has started ")
        const userDetails = await User.findById(req.user.id);
        console.log(userDetails.userid,"This is the user id");
        const {oldPassword , newPassword , ConfirmNewPassword} = req.body;
        console.log("This is the old password",oldPassword);
        console.log("This is the new password",newPassword,"This is the confirm password",ConfirmNewPassword)
        const idPasswrodMathc = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )

        console.log("This is the log after comparing the passowrd with the jwt token",idPasswrodMathc)

        if(!idPasswrodMathc){
            return res.status(401).json({
                success:false,
                message:"The password is not Correct"
            })
        }

        if(newPassword !== ConfirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"The password does not match"
            })
        }

        console.log(newPassword)
        console.log(ConfirmNewPassword);



        const encryptedPassword = await bcrypt.hash(ConfirmNewPassword,6);
        console.log("This is the encrypted password",encryptedPassword)
        const updateduserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password:encryptedPassword},
            {new:true}
        )
        console.log(updateduserDetails,"This is the updated details",updateduserDetails)


        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstname}`
                )
            );
            console.log(emailResponse,"This is the email response");
        } catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }


        console.log("password change has beeen ended")
        return res.status(200).json({
            success:true,
            message:"Password Is Updated SuccesFully"
        })

    } catch (error) {
        console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
            
			error: error.message,
		});
    }
}