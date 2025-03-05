const sequelize=require("../sqldb");
const {DataTypes}=require("sequelize");
const Subscription=sequelize.define('Subscription',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isEmail:true
        }
    },
    customer_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    product_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    frequency:{
        type:DataTypes.ENUM,
        values:["Weekly","Daily"],
        allowNull:false
    },  
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:1
        }
    },
    startDate:{
        type:DataTypes.DATE,
        allowNull:false
    },
    endDate:{
        type:DataTypes.DATE,
        allowNull:false
    }
},{
    tableName: "Subscription", // Ensures the table is named "Subscription"
    timestamps: true, // Disables `createdAt` and `updatedAt` if not required
});

module.exports=Subscription

