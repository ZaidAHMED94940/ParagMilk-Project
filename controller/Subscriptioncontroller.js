const Subscription = require("../models/Subscription");

// Create Subscription
const createSubscription = async (req, res) => {
    const {
        subscription_id,
        customer_id,
        product_id,
        product_name,
        frequency,
        quantity,
        price_per_unit,
        start_date,
        end_date,
    } = req.body;

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Quantity must be a positive integer.",
        });
    }

    // Validate start_date is in the future
    const currentDate = new Date();
    const startDate = new Date(start_date);
    
    if (startDate <= currentDate) {
        return res.status(400).json({
            status: "error",
            message: "Start date must be a future date.",
        });
    }

    // Validate end_date is after start_date
    const endDate = new Date(end_date);
    
    if (endDate <= startDate) {
        return res.status(400).json({
            status: "error",
            message: "End date must be after start date.",
        });
    }

    try {
        // Check if subscription_id already exists
        const existingSubscription = await Subscription.findOne({ subscription_id });
        if (existingSubscription) {
            return res.status(409).json({
                status: "error",
                message: "Subscription ID already exists.",
            });
        }

        const subscription = new Subscription({
            subscription_id,
            customer_id,
            product_id,
            product_name,
            frequency,
            quantity,
            price_per_unit,
            start_date,
            end_date,
        });

        await subscription.save();

        res.status(201).json({
            status: "success",
            message: "Subscription created successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error while creating subscription.",
        });
    }
};

// Get Subscriptions by Customer ID
const getSubscriptionsByCustomerId = async (req, res) => {
    const { customer_id}  = req.body;

    try {
        const subscriptions = await Subscription.find({ customer_id });

        if (!subscriptions.length) {
            return res.status(404).json({
                status: "error",
                message: "No subscriptions found for the given customer ID.",
            });
        }

        res.status(200).json({
            status: "success",
            data: subscriptions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error while retrieving subscriptions.",
        });
    }
};

// Delete Subscription by ID
const deleteSubscription = async (req, res) => {
    let { subscription_id } = req.params;

    // Convert subscription_id to a number
    subscription_id = parseInt(subscription_id, 10);

    if (isNaN(subscription_id)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid subscription ID. It must be a number.",
        });
    }

    try {
        const subscription = await Subscription.findOneAndDelete({ subscription_id });

        if (!subscription) {
            return res.status(404).json({
                status: "error",
                message: "Subscription not found.",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Subscription deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error while deleting subscription.",
        });
    }
};

const updateSubscription = async (req, res) => {
    let { subscription_id } = req.params;
    const { frequency, quantity } = req.body;

    // Convert subscription_id to a number
    subscription_id = parseInt(subscription_id, 10);

    if (isNaN(subscription_id)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid subscription ID. It must be a number.",
        });
    }

    // Validate frequency
    const validFrequencies = ["daily", "weekly"];
    if (frequency && !validFrequencies.includes(frequency)) {
        return res.status(400).json({
            status: "error",
            message: "Frequency must be either 'daily' or 'weekly'.",
        });
    }

    // Validate quantity
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity <= 0)) {
        return res.status(400).json({
            status: "error",
            message: "Quantity must be a positive integer.",
        });
    }

    try {
        // Find the subscription first to check if it exists and its end date
        const existingSubscription = await Subscription.findOne({ subscription_id });

        if (!existingSubscription) {
            return res.status(404).json({
                status: "error",
                message: "Subscription not found.",
            });
        }

        // Check if subscription is active
        const currentDate = new Date();
        const endDate = new Date(existingSubscription.end_date);

        if (endDate < currentDate) {
            return res.status(400).json({
                status: "error",
                message: "Cannot modify an inactive subscription.",
            });
        }

        // Update only the provided fields
        const updateFields = {};
        if (frequency) updateFields.frequency = frequency;
        if (quantity !== undefined) updateFields.quantity = quantity;

        // Update the subscription
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { subscription_id },
            { $set: updateFields },
            { new: true }
        );

        res.status(200).json({
            status: "success",
            message: "Subscription updated successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error while updating subscription.",
        });
    }
};

const getAllSubscriptions = async (req, res) => {
    const { page_no = 1 } = req.body; // Changed from req.body to req.query for better REST practices
    const limit = 10; // Items per page

    try {
        // Convert page_no to number and validate
        const pageNumber = parseInt(page_no, 10); 
        
        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({
                status: "error",
                message: "Page number must be a positive integer.",
            });
        }

        // Get total count of subscriptions for pagination info
        const totalCount = await Subscription.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        // Get paginated subscriptions
        const subscriptions = await Subscription.find()
            .sort({ created_at: -1 }) // Sort by creation date, newest first
            .skip((pageNumber - 1) * limit)
            .limit(limit);

        // Check if any subscriptions exist
        if (!subscriptions.length) {
            return res.status(404).json({
                status: "error",
                message: "No subscriptions found.",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                subscriptions,
                pagination: {
                    current_page: pageNumber,
                    total_pages: totalPages,
                    total_items: totalCount,
                    items_per_page: limit
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error while retrieving subscriptions.",
        });
    }
};

module.exports = {
    createSubscription,
    getSubscriptionsByCustomerId,
    deleteSubscription,
    updateSubscription,
    getAllSubscriptions
};
