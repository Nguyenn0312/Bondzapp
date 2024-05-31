const mongoose = require("mongoose");
const config = require("../config");

const orderSchema = mongoose.Schema(
    {
        bond: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bond",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        type: {
            type: String,
        },
		quantity: {
			type: Number,
		},
        isFixed: {
            type: Boolean,
        },
        price: {
            type: Number,
            required: true
        },
        total_price: { 
            type: Number,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
