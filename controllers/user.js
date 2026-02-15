const User = require("../models/user.js");

module.exports.home = (req, res) => {
    res.render("home.ejs");
};

module.exports.chooseRole = (req, res) => {
    res.render("user/choose-role.ejs");
};

module.exports.signupForm = (req, res) => {
    const role = req.query.role === "seller" ? "seller" : "buyer";
    res.render("user/sign.ejs", { role });
};

module.exports.signupUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        const userRole = role === "seller" ? "seller" : "buyer";
        const newUser = new User({ email, username, role: userRole });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash("success", userRole === "seller" ? "Welcome! You can now list your properties." : "Welcome! Start exploring properties.");
            if (userRole === "seller") return res.redirect("/seller/dashboard");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", "A user with this username or email is already registered.");
        res.redirect(`/signup?role=${req.body.role || "buyer"}`);
    }
};

module.exports.loginForm = (req, res) => {
    const role = req.query.role === "seller" ? "seller" : "buyer";
    res.render("user/login.ejs", { role });
};

module.exports.loginUser = async (req, res) => {
    const role = req.body.role === "seller" ? "seller" : "buyer";
    if (req.user.role !== role) {
        req.flash("error", `You are registered as a ${req.user.role}. Please choose "${req.user.role}" to login.`);
        return res.redirect(`/login?role=${role}`);
    }
    req.flash("success", role === "seller" ? "Welcome back, seller!" : "Welcome back!");
    const redirectUrl = res.locals.session || (role === "seller" ? "/seller/dashboard" : "/listings");
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully.");
        res.redirect("/");
    });
};