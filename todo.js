const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Background = require("./models/BG.js");
const path = require("path");
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

main()
    .then(() => {
        console.log("Connect to dataBase");
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/to-do');

}

app.listen(port, function () {
    console.log("To-Do-App is listinging on port", port);
})
app.get("/", (req, res) => {
    let imgUrl = "https://cdn.wallpapersafari.com/27/32/jt4AoG.jpg";
    res.status(200).render("listing/home.ejs", { imgUrl })
})

//login request
app.get("/login", (req, res) => {
    res.status(200).render("listing/login.ejs")
})
app.get("/create", (req, res) => {
    res.status(200).render("listing/create.ejs")
})

app.get("/background", async (req, res) => {
    let allBG = await Background.find({});
    res.status(200).render("listing/background.ejs", { allBG })
})
app.get("/bg/:id", async (req, res) => {
    const { id } = req.params;
    let img = await Background.findById(id);
    res.render("listing/home", { imgUrl: img.url });
});

app.post("/user", async (req, res) => {
    const user = new User({
        ...req.body.user
    })
    await user.save();
    res.render("listing/userDetails.ejs", { user })
})

app.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    let user = await User.findById(id);
   
    res.status(200).render("listing/home2", { user })
})

app.post("/user/:id",async(req,res)=>{
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    
    let listing = req.body.list;
    if (!listing) {
        return res.status(400).send('No task provided');
    }
    listing.user=user;
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
app.get("/show/:id" ,async (req,res)=>{
    const { id } = req.params;
    let user = await User.findById(id);
    res.render("listing/showDetails.ejs",{user});
})
// app.get("/delete/:id",async(req,res)=>{
//     let {id}=req.params;
//     let listing=await Listing.findById(id);
//     console.log(listing);
//     let userId=listing.user;
//     let user=await User.findById(userId);
//     console.log(user.name);
//     (user.listing).map((list)=>{
//         if(list==id){

//         }
//     })
// })

app.use((err,req,res,next)=>{
    console.log("Somthig went wrong");
    res.status(200).send("Something went wring");

})