const Message = require("../models/message.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

module.exports.inbox = async (req, res) => {
    const userId = req.user._id;
    const messages = await Message.find({ $or: [{ from: userId }, { to: userId }] })
        .populate("listing", "title price image")
        .populate("from", "username email")
        .populate("to", "username email")
        .sort({ createdAt: -1 });
    const threads = {};
    messages.forEach((m) => {
        const other = m.from._id.toString() === userId.toString() ? m.to : m.from;
        const key = [m.listing._id.toString(), other._id.toString()].sort().join("-");
        if (!threads[key]) {
            threads[key] = { listing: m.listing, other, messages: [], lastAt: m.createdAt };
        }
        threads[key].messages.push(m);
        if (m.createdAt > threads[key].lastAt) threads[key].lastAt = m.createdAt;
    });
    const threadList = Object.values(threads).sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));
    res.render("messages/inbox.ejs", { threadList });
};

module.exports.thread = async (req, res) => {
    const { listingId, userId: otherId } = req.params;
    const listing = await Listing.findById(listingId).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    const other = await User.findById(otherId);
    if (!other) {
        req.flash("error", "User not found.");
        return res.redirect("/listings");
    }
    const messages = await Message.find({
        listing: listingId,
        $or: [
            { from: req.user._id, to: otherId },
            { from: otherId, to: req.user._id }
        ]
    }).populate("from", "username").sort({ createdAt: 1 });
    await Message.updateMany({ to: req.user._id, listing: listingId, read: false }, { read: true });
    res.render("messages/thread.ejs", { listing, other, messages });
};

module.exports.send = async (req, res) => {
    const { listingId } = req.params;
    const { body } = req.body;
    const listing = await Listing.findById(listingId).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    const toUserId = listing.owner._id;
    const newMsg = new Message({
        listing: listingId,
        from: req.user._id,
        to: toUserId,
        body: (body || "").trim()
    });
    await newMsg.save();
    req.flash("success", "Message sent!");
    res.redirect(`/messages/thread/${listingId}/${toUserId}`);
};

module.exports.reply = async (req, res) => {
    const { listingId, userId: otherId } = req.params;
    const { body } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    const newMsg = new Message({
        listing: listingId,
        from: req.user._id,
        to: otherId,
        body: (body || "").trim()
    });
    await newMsg.save();
    req.flash("success", "Reply sent!");
    res.redirect(`/messages/thread/${listingId}/${otherId}`);
};