const Listing = require("../models/listing.js");
const Message = require("../models/message.js");

module.exports.dashboard = async (req, res) => {
    const myListings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
    const messagesToMe = await Message.find({ to: req.user._id })
        .populate("listing", "title price image")
        .populate("from", "username email")
        .sort({ createdAt: -1 })
        .limit(20);
    res.render("seller/dashboard.ejs", { myListings, messagesToMe });
};
