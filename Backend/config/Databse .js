const mongoose = require('mongoose')
require('dotenv').config();
const Db_connection =()=>{
    mongoose.connect(process.env.DATABASE_URL_LINK)
    .then(()=>{
        console.log("The database Connection is done")
    })
    .catch(()=>{
        console.log("There is an error in the code")
    })
}

module.exports = Db_connection