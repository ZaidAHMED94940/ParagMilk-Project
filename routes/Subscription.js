const express = require("express");
const router = express.Router();
const {
    createSubscription,
    getSubscriptionsByCustomerId,
    deleteSubscription,
    updateSubscription,
    getAllSubscriptions
} = require("../controller/Subscriptioncontroller");

// Routes
router.post("/subscriptions", createSubscription);
router.post("/subscriptions/customer", getSubscriptionsByCustomerId);
router.delete("/subscriptions/:subscription_id", deleteSubscription);
router.put('/subscriptions/:subscription_id', updateSubscription);
router.post('/subscription/all',getAllSubscriptions)

module.exports = router;
