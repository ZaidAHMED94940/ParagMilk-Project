const express=require("express");
const app=express();
const dotenv=require("dotenv");
const connectDB = require("./db");
const SubscriptionRoutes=require('./routes/Subscription')

dotenv.config();
const PORT=process.env.PORT
app.use(express.json());

connectDB();
app.use('/api/v1',SubscriptionRoutes)


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})