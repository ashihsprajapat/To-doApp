
const mongoose = require("mongoose");
const Background=require("../models/BG.js");
const BGim=require("./dataBg.js");
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

async function push(){
    await Background.deleteMany({});
    await Background.insertMany(BGim.url);
    console.log("data is inserted in data base");
};
push();