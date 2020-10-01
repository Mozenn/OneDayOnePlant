const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastDrawDate: {
    type: Date,
    default: "1997-01-31",
  },
  lastDrawPlant: {
    type: Schema.Types.ObjectId,
    ref: "Plant",
  },
  score: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  plants: [{ type: Schema.Types.ObjectId, ref: "Plant" }],
});

module.exports = mongoose.model("User", userSchema);
