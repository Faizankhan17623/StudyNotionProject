const nodemailer = require('nodemailer');
require('dotenv').config()
const mailSender = async(email,title,body)=>{
    try{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port:465,
            host:process.env.HOST_NAME,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info  = await transporter.sendMail({
            from : "Faizan khan at the project Faiznkhan901152@gmail.com",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info)

        // Verifieng the nodemier is connected or not


        transporter.verify((error,success)=>{
            if(error){
                console.log("Error while COnnection the nodemailer");
                console.log(error)
            }else{
                console.log("The Connection is done");
                console.log(success)
            }
        })
        return info
    }catch(error){
        console.log("Error in the code");
        console.log(error)
    }
}

module.exports = mailSender