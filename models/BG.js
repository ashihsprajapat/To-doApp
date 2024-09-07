const mongoose=require("mongoose");
const {Schema}=mongoose;

const backgroundSchema=new Schema({
    url:{
        type:String
    }
})
module.exports=mongoose.model("Background",backgroundSchema);