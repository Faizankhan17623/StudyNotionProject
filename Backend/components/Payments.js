const {instance} =require('../config/razorpay');
const Cource = require('../modules/Cource');
const User = require('../modules/Users')
const mailSender = require('../utils/nodemailer');
const mongoose = require('mongoose');
const {courseEnrollmentEmail} = require('../mail/templates/courceEnrollment')


exports.CreatePayment=async(req,res)=>{
    const {cource_id} = req.body;
    const userId = req.user.id;
    if(!cource_id){
        return res.json({
            success:false,
            message:'Please provide valid course ID',
        })
    }

    let Course;
    try {
        Course = await Cource.findById(cource_id);
        if(!Cource){
            return res.json({
                success:false,
                message:'Could not find the course',
            });
        }

        const uid = new mongoose.Schema.Types.ObjectId(userId);
        if(Course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message:'Student is already enrolled',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }


    const amount = amount.price;
    const currencry = "INR";

    const options = {
        amount:amount*100,
        currencry,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            COurcSeId:cource_id,
            userId
        }

    }


    try {
        const PaymentResponserr = await instance.orders.create(options);
        console.log(PaymentResponserr);
        return res.status(200).json({
            success:true,
            courseName:Course.courseName,
            courseDescription:Course.courseDescription,
            thumbnail: Course.thumbnail,
            orderId: PaymentResponserr.id,
            currency:PaymentResponserr.currency,
            amount:PaymentResponserr.amount,
        })
    } catch (error) {
        console.log(error);
            res.json({
                success:false,
                message:"Could not initiate order",
            });
    }
}


exports.VerifySignature=async(req,res)=>{
    const WebHookSecret = "123456";
    const Signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmax("sha256",WebHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(Signature === digest){
        console.log("The paymet is doed");
        const {cource_id,userId} = req.body.payload.payment.entity.notes
        try {
            const EnrollCources = await Cource.findOneAndUpdate(
                {_id:cource_id},
                {$push:{studentsEnrolled:userId}},
                {new:true}
            )

            if(!EnrollCources) {
                return res.status(500).json({
                    success:false,
                    message:'Course not Found',
                });
            }
            console.log(EnrollCources);


            const EnrolledStudents = await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:cource_id}},
                {new:true},
            )


            const EmailResponse = await mailSender(
                EnrolledStudents.email,
                "Congratulations from CodeHelp",
                                        "Congratulations, you are onboarded into new CodeHelp Course",
            )
            console.log(EmailResponse)

            return res.status(200).json({
                success:true,
                message:"Signature Verified and COurse Added",
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
}