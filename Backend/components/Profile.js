const Profile = require('../modules/Profile')
const User = require('../modules/Users')
const {imageUpload} = require('../utils/imageuploader')
exports.updateProfile = async (req,res) => {
    try {
        const{dateofbirth ="",about ="",contactNumber} = req.body;
        const  id  = req.user.id;

        const UserDetails = await User.findById(id);
        const ProfileDetails = await Profile.findById(UserDetails.additionalDetails);

        ProfileDetails.dateofbirth = dateofbirth;
        ProfileDetails.about =about;
        ProfileDetails.contactNumber = contactNumber;

        await ProfileDetails.save();
        return res.status(200).json({
            success:true,
            message:"The data is been uploaded"
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


exports.DeleteAccount = async (req,res) => {
    try {
        const {id} = req.body;  
        const UserDetails = await User.findById({_id:id})
        console.log(UserDetails)
        if(!UserDetails){
            return res.status(400).json({
                success:false,
                message:"The user details are required"
            })
        }
        
        await Profile.findByIdAndDelete({_id:UserDetails.additionalDetails});
        await User.findByIdAndDelete({_id:id})
        res.status(200).json({
            success:true,
            message:"Ths user is Already registered"
        })    
        } catch (error) {
        console.log(error);
        console.log("THere is an error in the code");
        return res.status(500).json({
            success:false,
            message:"User Cannot be deleted successfully"
        })
    }
}

exports.getAllUsers = async (req,res) => {
    try {
        const id = req.user.id;
        const UserDetails = await User.findById(id).populate('additionalDetails').exec();
        console.log(UserDetails)
        return res.status(200).json({
            success:true,
            message:"user data Fetch",
            data: UserDetails,
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



exports.updatedisplayPicture = async(req,res)=>{
    try {
        const displayPicture = await req.files.displayPicture;
        const userId = req.user.id;
        const image = await imageUpload(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
        {_id:userId},
        {image:image.secure_url},
        {new:true}
    )
    res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}




exports.GetEnrolledCources = async(req,res)=>{
    try {
        const userId = req.user.id;
        const userDetails = await User.findOne({
            _id:userId
        })
        .populate("Cources")
        .exec()


        if(!userDetails){
            return res.status(200).json({
                success: true,
                data: userDetails.courses,
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}