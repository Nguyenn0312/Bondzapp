const mongoose = require("mongoose");
const config = require("../config");

const bondSchema = mongoose.Schema(
	{
		symbol: {
			type: String,
		},
		series: {
			type: String,
		},
		bondType: {
			type: String,
		},
		couponrate: {
			type: Number,
		},
		faceValue: {
			type: Number,
		},
	    ltp: {
			type: String,
		},
		volume: {
			type: Number,
		},
		creditRating: {
			type: String,
		},
		maturityDate: {
			type: Date,
		},
		price: {
			type: [Number],
			default: [0, 0, 0, 0, 0, 0],
		},
		desc: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Bond", bondSchema);
