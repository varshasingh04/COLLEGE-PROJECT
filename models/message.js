const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
