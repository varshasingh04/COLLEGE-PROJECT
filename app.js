if(process.env.NODE_EVN != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./routes/user.js");



// const wrapAsync = require("./utils/wrapAsync.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then( () => {
    console.log("connected to DB")
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
    secret : "myappsecretcode",
    resave: false,
    saveUninitialized : true,
    cookie: {
        expire: Date.now() + 7* 24* 60* 60*  1000,
        maxAge :  7* 24* 60* 60*  1000
    }
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// app.get("/", (req,res) => {
//     res.send("Hi i'm root");
// });
 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demo", async(req,res) => {
//     let fakeUser = ({
//         email: "abcd@gmail.com",
//         username: "avinash"
//     })
//     let newUser = await User.register(fakeUser,"helloworld");
//     res.send(newUser);
// });

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",user);


app.use((err,req,res,next) => {
    let{statusCode=500, message="something wrong"} =err;
    res.status(statusCode).render("error.ejs",{message});
   
});


app.listen(8080,() => {
    console.log("server is lising to port 8080");
});


 