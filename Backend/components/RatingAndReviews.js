const RatingAndReviews = require('../modules/RatingandReviews');
const Cources = require('../modules/Cource');
const mongoose = require('mongoose')
exports.CreateRating = async(req,res)=>{
    try {
        const userId = req.user.id;
        const {rating,review,course} = req.body;
        const CourcesDetails = await Cources.findOne({
            _id:course,
            studentsEnrolled:{$eleMatch:{$eq:userId}}
        })

        if(!CourcesDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not Enrolled in the COurce"
            })
        }



        const alreadReview = await RatingAndReviews.findOne({
            user:userId,
            cource:course
        })

        if(alreadReview){
            return res.status(403).json({
                success:false,
                message:"Cource is already Reviewed"
            })
        }

        const RatingReview = await RatingAndReviews.create({
            rating:review,
            cource:course,
            user:userId
        })

        const UpdatedCourceDetails = await Cources.findByIdAndUpdate({_id:course},
            {
                $push:{
                    RatingAndReviews:RatingReview._id,
                },
            },
            {new:true}
        )
        console.log(UpdatedCourceDetails)
        return res.status(200).json({
            success:true,
            message:"Rating And Review Created",
            RatingReview
        })

        
    } catch (error) {
        console.log("Error in the code");
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


exports.getAverageRating = async(req,res)=>{
    try {
        const courceId = req.body.courceId
        const result  = await RatingAndReviews.aggregate([
            {
                $match:{
                    cource:new mongoose.Types.ObjectId(courceId),
                },
            },
            {
                $group:{
                    _id:null,
                    getAverageRating:{$avg:"$rating"}
                }
            }
        ])


        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }


        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no ratings given till now',
            averageRating:0,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


exports.GetAllRating = async(req,res)=>{
    try {
        const AllRating = await RatingAndReviews.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"Firstname Lastname email image",
        })
        .populate({
            path:"course",
            select:"courceName"
        })
        .exec();

        return res.status(200).json({
            success:true,
            message:"The reviews are Fetched succesfully",
            data:AllRating
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}