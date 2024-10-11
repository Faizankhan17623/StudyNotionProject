const mongoose = require('mongoose');
const coursesSchema= new mongoose.Schema({
    courcename:{
        type:String
    },
    courceDescription:{
        type:String
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    whatYouWillLearn:{
        type:String
    },
    courceContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    ratingAndreviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price:{
        type:Number
    },
    thumbnail:{
        type:String
    },
    tag:{
        type:[String],
        required:true
    },
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }],
    category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
	studentsEnrolled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "user",
		},
	],
	instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
});
module.exports  =mongoose.model("Course",coursesSchema) 