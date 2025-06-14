const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsycn = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then( () => {
    console.log("connected to DB")
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("Hi i'm root");
});

app.get("/listings", async (req, res) => {
     const allListings = await Listing.find({});
        // console.log(res);
        res.render("listings/index.ejs",{allListings});
        });
 
app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});


app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
     const listing = await Listing.findById(id);
    // console.log("Fetched listing:", listing); //debug
    res.render("listings/show.ejs",{listing});
    
});       

app.post("/listings", wrapAsycn(async (req,res,next) => {
  
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
   
}));

app.get("/listings/:id/edit", async(req,res) => {
    let {id} = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit.ejs",{listing});

});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.all("*",(req, res, next) => {
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next) => {
    let{statusCode,message} = err;
   res.status(statusCode).send(message);
});


app.listen(8080,() => {
    console.log("server is lising to port 8080");
});


 // let listing = {title, description, image, price, country, location};
 // let listing =req.body;
    // console.log(listing);


// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing ({
//         title:"My New Villa",
//         description: "By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });    