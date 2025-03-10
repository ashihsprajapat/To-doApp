const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Background = require("./models/BG.js");
const path = require("path");
//for passport authenticate
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const flash=require("connect-flash");
const {isLogined}=require("./middleware.js");
const dotenv= require("dotenv")
dotenv.config()

const port = 8080;
const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, ("views")))
app.use(methodOverride('_method'));//middlewares
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));//middlewares
app.use(express.json());

//set up for session
app.set('trust proxy', 1) // trust first proxy
const option = {
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
};
app.use(session(option));
app.use(flash())

//for authenticate
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//for user route
const userRoute = require("./routes/user.js");
const backgroundRoute=require("./routes/background.js");
app.use("/", userRoute);
app.use("/background",backgroundRoute);

const url= process.env.MONGO_URL;

async function main() {
    await mongoose.connect(`${url}`);

}

main()
    .then(() => {
        console.log("Connect to dataBase");
    })
    .catch((err) => {
        console.log(err);
    })




app.listen(port,  ()=>{
    console.log("To-Do-App is listinging on port", port);
})


app.get("/", (req, res) => {
    let imgUrl = "https://cdn.wallpapersafari.com/27/32/jt4AoG.jpg";
    res.status(200).render("listing/home.ejs", { imgUrl })
})


// app.get("/background", async (req, res) => {
//     let allBG = await Background.find({});
//     res.status(200).render("listing/background.ejs", { allBG })
// })
app.get("/bg/:id", async (req, res) => {
    const { id } = req.params;
    let img = await Background.findById(id);
    res.render("listing/home", { imgUrl: img.url });
});


app.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    let user = await User.findById(id);

    res.status(200).render("listing/home2", { user })
})

app.post("/user/:id", async (req, res) => {
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).send('User not found');
    }

    let listing = req.body.list;
    if (!listing) {
        return res.status(400).send('No task provided');
    }
    listing.user = user;
    let listingDocs = [];
    if (typeof listing === 'string') {
        listingDocs.push(await Listing.create({ list: listing }));
    } else if (Array.isArray(listing)) {
        listingDocs = await Listing.insertMany(listing.map(item => ({ list: item })));
    }
    const listingIds = listingDocs.map(doc => doc._id);



    user.listing.push(...listingIds);  // Add the ObjectIds of the new listings
    await user.save();


    let allListing = await Listing.find({ _id: { $in: user.listing } });  // Fetch the full listing details
    res.status(200).render("listing/home2T", { user: user, allListing: allListing });

})
app.get("/show/:id", async (req, res) => {
    const { id } = req.params;
    let user = await User.findById(id);
    res.render("listing/showDetails.ejs", { user });
})


app.use((err, req, res, next) => {
    res.status(200).send("Something went wring");
})