const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    cources:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
    ]
});
module.exports = mongoose.model("Category",CategorySchema) 