const express = require("express");
const { route } = require("./user");
const router = express.Router();
const Background=require("../models/BG")


router.route("/")
.get(async(req,res)=>{
    let allBG = await Background.find({});
    //console.log(allBG)
    res.render("listing/background.ejs",{allBG})
})


module.exports=router;