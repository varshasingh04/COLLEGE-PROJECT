const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewaves.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.signupForm)
  .post(wrapAsync(userController.signupUser)
  );

router
  .route("/login")
  .get(userController.loginForm)
   .post(
    saveRedirectUrl ,
    passport.authenticate("local", { failureRedirect: "/login",failureFlash: true
    }),
    userController.loginUser
);

router.get("/logout",userController.logoutUser);

module.exports = router; 