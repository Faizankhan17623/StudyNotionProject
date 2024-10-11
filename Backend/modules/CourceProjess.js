const mongoose = require('mongoose');
const courceProgress = new mongoose.Schema({
    courceID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completedVideos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection"
    }]
});
module.exports  =mongoose.model("courseProgress",courceProgress) 