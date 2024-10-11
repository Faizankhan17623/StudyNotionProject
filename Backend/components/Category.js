const Category = require('../modules/Category');

exports.Createcategory = async(req,res)=>{
    try {
        const {name,description} = req.body;
        if(!name||!description){
            return res.status(500).json({
                success:false,
                message:"The name and the description are not required"
            })
        }

        const Creation = await Category.create({name,description});
        console.log(Creation);
        res.status(200).json({
            success:true,
            message:`The Categorey is been created`
        })
    } catch (error) {
        console.log("There is an error in  the code");
        console.log(error)
        return res.status(500).json({
			success: true,
			message: error.message,
		});
    }
}

exports.GetAllCategories = async (req,res) => {
    try {
        const FetchAll = await Category.find({},{name:true},{description:true});
        console.log(FetchAll);
        res.status(200).json({
            success:true,
            message:`The data is been created ${FetchAll}`
        })
    } catch (error) {
        console.log("There is an error in  the code");
        console.log(error)
    }
}


exports.CategroyPageDetails = async(req,res)=>{
    try {
        const {categoryId} = req.body;
        const SelectedCources =await Category.findById(categoryId).populate("courses").exec();
        if(!SelectedCources){
            return res.status(404).json({
                success:false,
                message:"Data not Found"
            })
        } 

        const DifferentCategories = await Category.find({_id:{$ne:categoryId}}).populate("cources").exec();
          //get top 10 selling courses
            //HW - write it on your own
        return res.status(200).json({
            success:true,
            data:{
                SelectedCources,
                DifferentCategories
            }
        })
    } catch (error) {
        console.log("error in the code");
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}