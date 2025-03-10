const { name } = require("ejs");
const express=require("express");
const mongoose = require("mongoose");
const Listing=require("./listing");
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    
})
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);