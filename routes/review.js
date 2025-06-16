const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview} = require("../middlewaves.js");
const {isLoggedIn, isReviewAuthor} = require("../middlewaves.js");
const reviewController = require("../controllers/review.js");


// Add a review to a listing
router.post("/",isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));

//Reviwes delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;  // Export the router
