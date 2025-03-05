const express = require("express");
const router = express.Router();
const SubscriptionModel = require("../models/MySqlSubscriptionModel");

router.post("/", async (req, res) => {
    try {
        const {
            subscription_id, // Add this field only if it's in the model
            customer_id,
            product_id,
            product_name, // Add this field only if it's in the model
            frequency,
            quantity,
            price_per_unit,
            start_date,
            end_date,
        } = req.body;

        // Validation: Quantity should be greater than 0
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Quantity should be greater than 0" });
        }

        // Validation: Start date should be greater than today
        const currentDate = new Date();
        const parsedStartDate = new Date(start_date);
        if (parsedStartDate <= currentDate) {
            return res.status(400).json({ message: "Start Date should be greater than today" });
        }

        // Validation: End date should be greater than start date
        const parsedEndDate = new Date(end_date);
        if (parsedEndDate <= parsedStartDate) {
            return res.status(400).json({ message: "End Date should be greater than Start Date" });
        }

        // Create a new subscription if validations pass
        const newSubscription = await SubscriptionModel.create({
            subscription_id, // Add only if it's in the model
            customer_id,
            product_id,
            product_name, // Add only if it's in the model
            frequency,
            quantity,
            price_per_unit,
            start_date: parsedStartDate,
            end_date: parsedEndDate,
        });

        // Success response
        res.status(201).json({
            message: "Successfully implemented the subscription",
            subscription: newSubscription,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/getall/:subscriptionid',async(req,res)=>{
    const subscriptionid=req.params.subscriptionid;
    try{
        const subscription=await SubscriptionModel.findById(subscriptionid);
        if(!subscription){
            res.status(400).json({message:"The SubscriptionId is invalid"});
        }


    }catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.get('/all', async (req, res) => {
    const { page_no = 1 } = req.query; // Use req.query for RESTful practices
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
        const totalCount = await Subscription.count();
        const totalPages = Math.ceil(totalCount / limit);

        // Get paginated subscriptions
        const subscriptions = await Subscription.findAll({
            order: [['createdAt', 'DESC']], // Sort by creation date, newest first
            offset: (pageNumber - 1) * limit, // Skip rows for pagination
            limit: limit, // Limit the number of rows fetched
        });

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
});
module.exports = router;
