const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      // required: true
    },
    url: {
      type: String,
      // required: true,
      default: "https://unsplash.com/photos/silhouette-of-mountain-during-sunset-wr8VZnLX00A",
      set: (v) =>
        v === ""
          ? "https://unsplash.com/photos/silhouette-of-mountain-during-sunset-wr8VZnLX00A"
          : v
    }
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

