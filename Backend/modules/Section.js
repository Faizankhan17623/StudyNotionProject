const mongoose = require('mongoose');
const Section = new mongoose.Schema({
    SectionName:{
        type:String
    },
    subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
        required:true
    }]
});
module.exports  =mongoose.model("Section",Section) 