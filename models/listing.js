const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    // required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      // 
      default: "default2.jpg"
    },
    url: {
      type: String,
      // required: true,
      default: "/images/default2.jpg",
      set: (v) =>
        v === ""
          ? "/images/default2.jpg"
          : v
    }
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    // required: true
  },
  country: {
    type: String,
    // required: true
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

