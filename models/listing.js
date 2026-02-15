const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { url: String, filename: String },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  country: { type: String, required: true },
  locality: { type: String, default: "" },
  area: { type: Number, default: null },
  propertyType: {
    type: String,
    enum: ["apartment", "house", "villa", "plot", "commercial", "pg", "other"],
    default: "other"
  },
  bedrooms: { type: Number, default: null },
  bathrooms: { type: Number, default: null },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["apartment", "house", "villa", "plot", "commercial", "pg", "other"]
  }
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

