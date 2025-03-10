const express=require("express");
const router=express.Router();

module.exports.isLogined=(req,res,next)=>{
    if(!req.isAuthenticate() ){
        req.flash("error","You must be logined ")
    }
    res.redirect("/login");
}