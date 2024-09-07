const User =require("./user");
const mongoose=require("mongoose");
const {Schema}=mongoose;
const listingSchema=new Schema({
    list:{
        type:String,
    },user:{
        type:mongoose.Schema.Types.ObjectId,
        rel:"User",
    }
})

module.exports=mongoose.model("Listing",listingSchema);