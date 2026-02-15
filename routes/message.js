const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middlewaves.js");
const messageController = require("../controllers/message.js");

router.get("/", isLoggedIn, wrapAsync(messageController.inbox));
router.get("/thread/:listingId/:userId", isLoggedIn, wrapAsync(messageController.thread));
router.post("/thread/:listingId/:userId", isLoggedIn, wrapAsync(messageController.reply));

module.exports = router;
