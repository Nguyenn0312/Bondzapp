const mongoose = require("mongoose");
const config = require("../config");

const userInvestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bond: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bond",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserInvest", userInvestSchema);