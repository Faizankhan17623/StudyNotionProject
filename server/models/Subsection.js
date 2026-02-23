const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
	title: { type: String },
	timeDuration: { type: String },
	description: { type: String },
	videoUrl: { type: String },
	// FEATURE-15: Downloadable resources attached to this lesson
	resources: [
		{
			title: { type: String, required: true },
			fileUrl: { type: String, required: true },
		},
	],
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
