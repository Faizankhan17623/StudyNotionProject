const Section = require('../modules/Section')
const Cources = require('../modules/Cource')
exports.CreateSection = async (req,res) => {
    try {
        const {SectionName,courceID} = req.body

        if(!SectionName ||  ! courceID){
            return res.status(400).json({
                success:false,
                message:"Both the input are required"
            })
        }

        const NewSection  = await Section.create({SectionName});
        const UpdateCourceDetails = await Cources.findByIdAndUpdate(
            courceID,
            {
                $push:{
                    CourceContent:NewSection._id
                },
            },
            {new:true}
        )

        console.log(UpdateCourceDetails)

        return res.status(200).json({
            success:true,
            message:"The data is been uploaded"
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


exports.UpdateSection = async (req,res) => {
    try {
        const {SectionName,subSection} = req.body
        if(!SectionName ||  ! subSection){
            return res.status(400).json({
                success:false,
                message:"Both the input are required"
            })
        }

        const Section = await Section.findByIdAndUpdate(subSection,{SectionName},{new:true});
        console.log("This is from the Section",Section);
        return res.status(200).json({
            success:true,
            message:"The data is been uploaded"
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



exports.DeleteSection = async (req,res) => {
    try {
        const{subSection} = req.body;
        await Section.findByIdAndDelete(subSection)

        return res.status(200).json({
            success:true,
            message:"The data is been deleted"
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