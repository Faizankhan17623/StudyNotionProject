const cloudinary = require('cloudinary').v2

exports.imageUpload = async (file,folder,height,quality) => {
    const {options} = req.body;
    if(height){
        options.height = height
    }
    if(quality){
        options.quality= quality
    }
    options.resource_type = "auto"
    return await cloudinary.uploader.upload(file.tempFilePath,options)
}