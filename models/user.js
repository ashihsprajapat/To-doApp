const { name } = require("ejs");
const mongoose = require("mongoose");
const Listing=require("./listing");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    passwerd: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    
    listing: [{
        type: Schema.Types.ObjectId,
        ref: "Listing",
    },
    ]
})

module.exports = mongoose.model("User", userSchema);