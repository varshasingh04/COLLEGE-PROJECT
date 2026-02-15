const Listing = require("../models/listing.js");
const Message = require("../models/message.js");

module.exports.index = async (req, res) => {
    const { priceMin, priceMax, locality, areaMin, areaMax, propertyType, bedrooms } = req.query;
    const filter = {};

    if (priceMin !== "" && priceMin != null) filter.price = Object.assign(filter.price || {}, { $gte: Number(priceMin) });
    if (priceMax !== "" && priceMax != null) filter.price = Object.assign(filter.price || {}, { $lte: Number(priceMax) });
    if (locality && locality.trim()) filter.locality = new RegExp(locality.trim(), "i");
    if (areaMin !== "" && areaMin != null) filter.area = Object.assign(filter.area || {}, { $gte: Number(areaMin) });
    if (areaMax !== "" && areaMax != null) filter.area = Object.assign(filter.area || {}, { $lte: Number(areaMax) });
    if (propertyType && propertyType !== "all") filter.propertyType = propertyType;
    if (bedrooms !== "" && bedrooms != null && bedrooms !== "any") filter.bedrooms = { $gte: Number(bedrooms) };

    const allListings = await Listing.find(filter).populate("owner").sort({ createdAt: -1 });
    res.render("listings/index.ejs", { allListings, query: req.query });
};

module.exports.newForm =  (req,res) => {
    res.render("listings/new.ejs");
};    

module.exports.contactForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    res.render("listings/contact.ejs", { listing });
};

module.exports.contactSeller = async (req, res) => {
    const { id: listingId } = req.params;
    const listing = await Listing.findById(listingId).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    const newMsg = new Message({
        listing: listingId,
        from: req.user._id,
        to: listing.owner._id,
        body: (req.body.body || "").trim()
    });
    await newMsg.save();
    req.flash("success", "Message sent to seller!");
    res.redirect(`/messages/thread/${listingId}/${listing.owner._id}`);
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
     const listing = await Listing.findById(id)
     .populate({
        path:"reviews",
        populate: {
             path: "author",
        }
        
     })
     .populate("owner");
    
     if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
     }
    // console.log("Fetched listing:", listing); //debug
    console.log(listing.owner);
    
    res.render("listings/show.ejs",{listing});
    
};

module.exports.createListing = async (req, res, next) => {
    const url = req.file ? req.file.path : "";
    const filename = req.file ? req.file.filename : "";
    const data = { ...req.body.listing };
    if (data.area === "" || data.area === undefined) data.area = null;
    if (data.bedrooms === "" || data.bedrooms === undefined) data.bedrooms = null;
    if (data.bathrooms === "" || data.bathrooms === undefined) data.bathrooms = null;
    if (data.propertyType === "" || data.propertyType === undefined) data.propertyType = "other";
    const newListing = new Listing(data);
    newListing.owner = req.user._id;
    if (url) newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Property listed successfully!");
    res.redirect("/seller/dashboard");
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image && listing.image.url ? listing.image.url.replace("/upload", "/upload/w_250") : null;
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body.listing };
  if (data.area === "") data.area = null;
  if (data.bedrooms === "") data.bedrooms = null;
  if (data.bathrooms === "") data.bathrooms = null;
  let listing = await Listing.findByIdAndUpdate(id, data);
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect("/seller/dashboard");
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/seller/dashboard");
};

