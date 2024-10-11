const Section  = require('../modules/Section')
const {imageUpload} = require('../utils/imageuploader');
const SubSection = require('../modules/SubSection');
require('dotenv').config()
exports.Createsubsection = async (req,res) => {
    try {
        const {sectionId,title,description} = req.body

        const video = req.files.videoUrl

        if(!sectionId || !title || !description){
            return res.status(404).json({
                success:false,
                message:"All the inputs Fieds are required"
            })
        }

        const UploadDetails = await imageUpload(video,process.env.FOLDER_NAME)
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:UploadDetails.secure_url,
        })
        const UpdateSection = await Section.findByIdAndUpdate({_id:SubSection},{$push:{SubSection:SubSectionDetails._id},},
        {new:true}).populate('subSection')

        return res.status(200).json({
            success:true,
            data:UpdateSection
        })

    } catch (error) {
        console.log("Error in the code");
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"There is an error in the code"
        })
    }
}


exports.updateSubSection = async(req,res)=>{
    try {
        const{sectionId,title,description} = req.body;
        const subSection = await subSection.findById(sectionId);
        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        } 


        if(title !== undefined){
            subSection.title = title
        }


        if(description !== undefined){
            subSection.description = description
        }


        if(req,files && req.files.video !== undefined){
            const video =req.files.video
            const UploadDetails = await imageUpload(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = UploadDetails.secure_url
            subSection.timeDuration = `${UploadDetails.duration}`
        }


        await subSection.save();


        return res.status(200).json({
            success:true,
            message:"Section Update Succesfully"
        })
    } catch (error) {
        console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
}


exports.DeleteSection = async(req,res)=>{
    try {
        const {subSectionid,sectionId} = req.body;

        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{
                    subSection:subSectionid
                }
            }
        )

        const subSection = await SubSection.findByIdAndDelete(
            {_id:subSectionid}
        )

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"SubSection is not Found"
            })
        }

        return res.json({
            success: true,
            message: "SubSection deleted successfully",
          })
    } catch (error) {
    console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
}