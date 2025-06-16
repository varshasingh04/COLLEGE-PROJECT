const express = require("express");
const router = express.Router();
const wrapAsycn = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewaves.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const{storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.get("/",wrapAsycn(listingController.index));

router
  .route("/new")
  .get(isLoggedIn, listingController.newForm)
  .post(
    isLoggedIn, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsycn(listingController.  createListing)
   );
  

router
  .route("/:id")
  .get(wrapAsycn(listingController.showListing) )
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsycn(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner, 
    wrapAsycn(listingController.deleteListing)
);


//edit
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsycn (listingController.editListing));

//Error Handling Middleware
router.use((err,req,res,next) => {
    let{statusCode=500, message="something wrong"} =err;
    res.status(statusCode).render("error.ejs",{message});
   
});




module.exports = router;