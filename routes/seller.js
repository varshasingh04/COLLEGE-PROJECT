const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isSeller } = require("../middlewaves.js");
const sellerController = require("../controllers/seller.js");

router.get("/dashboard", isSeller, wrapAsync(sellerController.dashboard));

module.exports = router;
