const cloudinary = require("cloudinary").v2

exports.uploadImageToCloudinary = async (file, folder, height, quality, resourceType) => {
  const options = { folder }
  if (height) {
    options.height = height
  }
  if (quality) {
    options.quality = quality
  }
  // Use "raw" for PDFs/docs, "auto" for everything else
  options.resource_type = resourceType || "auto"
  return await cloudinary.uploader.upload(file.tempFilePath, options)
}
