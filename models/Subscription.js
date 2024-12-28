const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    subscription_id: {
        type: Number,
        required: true,
        unique: true,
    },
    customer_id: {
        type: Number,
        required: true,
    },
    product_id: {
        type: Number,
        required: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        required: true,
        enum: ["daily", "weekly"], // Ensures only "daily" or "weekly" is allowed
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"], // Ensures a positive integer
    },
    price_per_unit: {
        type: Number,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;