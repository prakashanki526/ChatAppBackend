const dotenv = require('dotenv').config();
const mongoose = require("mongoose");

const mongoUrl = process.env.MONGODB_URI;

function connection(){
    mongoose.set('strictQuery', false);
mongoose
    .connect(mongoUrl,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() =>{
        console.log("Database connected successfully");
    })
    .catch((err) =>{
        console.log("Database not connected successfully " + err);
    });

}

module.exports = connection;