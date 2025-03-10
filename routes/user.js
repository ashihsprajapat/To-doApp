const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport=require("passport");
router.get("/singup", (req, res) => {
    res.status(200).render("user/signup.ejs")
})
router.post("/signup", async (req, res) => {
    let { username, password, email } = req.body;
    let newUser = new User({ username, email });
    let registerUser = await User.register(newUser, password);
    req.login(registerUser,(err)=>{
        if(err)
            next(err);
    })
    req.flash("success", "Well come to To-Do App");
    res.redirect("/");
})

router.get("/login", (req, res) => {
    res.render("user/login.ejs")
})

router.post("/login",
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
        let { username, password } = req.body;
        const newUser = new User();
        req.flash("success", "WELLCOME Back to my website!");
        res.redirect("/");
    })



    router.get("/logout",(req,res)=>{
        req.logOut((err)=>{
            if(err)
                return next(err);
            req.flash("success","you are login");
            res.redirect("/");
        })
    })

module.exports = router;