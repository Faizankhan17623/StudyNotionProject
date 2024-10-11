const User = require('../modules/Users');
const mailSender = require('../utils/nodemailer')
const bcrypt = require('bcrypt')
exports.ResetPasswordsTokens = async (req,res) => {
    try {
        const {email} = req.body;
        const Finder = await User.findOne({email});
        if(!Finder){
            return res.status(400).json({
                success:false,
                messsage:"The email is not FOunded"
            })
        }

        const token = crypto.randomUUID();
        console.log("This is your token number",token)
        const updateDetals = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordsExpires:Date.now() + 5*60*1000,
            },
            {new:true}
        )
        console.log(updateDetals)
        const url = `http://localhost:3000/update-password/${token}`
        await mailSender(email,
            "password Update LInk",
            `Password Reset Link :${url}`
        )

        return res.json({
            success:true,
            message:"The email is been send please check you email and reset the ppassword"
        })
    } catch (error) {
        console.log("there is an error in the code");
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"There is an error in the code link not send"
        })
    }
}



exports.ResetPasswords = async (req,res) => {
    try {
        const {password,confirmpass,token} = req.body;
        if(password !== confirmpass){
            return res.status(500).json({
                success:false,
                messaeg:"The password doe not mathc"
            })
        }

        const userDetails = await User.findOne({token:token});
        if(!userDetails){
            return res.json({
                success:false,
                message:"The toke is not valid"
            })
        }

        if(userDetails.resetPasswordsExpires < Date.now()){
            return res.json({
                success:false,
                message:"The toke in expired please create a  new  one"
            })
        }

        const hashPasswords  = await bcrypt.hash(password,10);
        await User.findOneAndUpdate(
            {token:token},
            {password:hashPasswords},
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"The data is been resetted succesfully"
        })
    } catch (error) {
        console.log(error);
        console.log("Theree is an error in the code")
        return res.status(500).json({
            success:false,
            message:"There is an error in the code link not send"
        })
    }
}