const User = require("../models/user.js");

module.exports.signupForm = (req,res) => { res.render("user/sign.ejs");
  };

module.exports.signupUser = async(req,res) => {
    try{
        let{username, email, password} = req.body;
        const newUser = new User({email ,username});
        const registerUser = await User.register(newUser ,password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error","A user with the given username is already registered" );
        res.redirect("/signup");
    }
    
};

module.exports.loginForm = (req,res) => {
    res.render("user/login.ejs");
   };

module.exports.loginUser = async(req,res) => {
    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl = res.locals.session || "/listings";
    res.redirect(redirectUrl);

};

module.exports.logoutUser = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next();
        }
        req.flash("success", "logged you out!");
        res.redirect("/listings");
    });
};