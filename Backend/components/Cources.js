const Course = require('../modules/Cource');
const User  = require('../modules/Users')
const Category = require('../modules/Category')
const {imageUpload} = require('../utils/imageuploader');
exports.CreateCOurces = async (req,res) => {
    try {
        const userId = req.user.id;
        let {courcename,courceDescription,whatYouWillLearn,price,category,tag,status,instructions} = req.body;
        const thumbnail = req.files.thumbnailImage   

        if(! courcename ||! courceDescription ||! whatYouWillLearn ||! price ||! category ||!thumbnail||!tag){
            return res.status(400).json({
                success:false,
                message:"All Fields are rquired"
            })
        }


        if(!status || status === undefined){
            status="Draft"
        }
        const Finding = await User.findById(userId,{
            accountType:'Instructor'
        });
        console.log("The user Details are" ,Finding)

        if(!Finding){
            return res.status(404).json({
                success:false,
                message:"The instrutor Details arre not Found"
            })
        }


        const TagDetails = await Category.findById(category);
        if(!TagDetails){
            return res.status(404).json({
                success:false,
                message:"The category is not Found "
            })
        }

        const thumbnailImage = await imageUpload(thumbnail,process.env.FOLDER_NAME)
        console.log(thumbnailImage);
        const newCources = await Course.create({
            courcename,
            courceDescription,
            instructor :Finding._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:TagDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions:instructions
        })
        console.log(newCources)

        await User.findByIdAndUpdate(
            {_id:Finding._id},
            {
                $push:{
                    Cources:newCources._id
                },
            },
            {new:true}
        )
        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCources._id,
				},
			},
			{ new: true }
		);
        return res.status(200).json({
            success:true,
            message:"The Cource is been created"
        })
    } catch (error) {
        console.log(error);
        console.log("THere is an error in the code");
        return res.status(500).json({
            success:false,
            message:"THere is some error  in the code"
        })
    }
}

exports.ShowAllCources = async (req,res) => {
    try{
        const allCOurces = await Course.find({},{courcename:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndreviews:true,
            studentsEnrolled:true,
        })
        .populate('instructor')
        .exec()

        console.log(allCOurces);
        res.status(200).json({
            success:true,
            message:"The data is been uploaded",
            allCOurces
        })

    }catch(error){
        console.log(error);
        console.log("THere is an error in the code");
        return res.status(500).json({
            success:false,
            message:"THere is some error  in the code"
        })
    }
}
exports.GetCourcesDetails = async(req,res)=>{
    try {
        const {CourceId} = req.body;
        const CourseDetails = await Course.find(
            {_id:CourceId},)
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            }
        })
        .populate('category')
        .populate({
            path:"courceContent",
            populate:{
                path:"subSection"
            }
        })
        .exec();

        if(!CourseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${CourceId}`,
            });
        }
        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            data:CourseDetails,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}