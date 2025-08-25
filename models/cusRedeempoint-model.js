const mongoose = require("mongoose");

const CustomerRedeemRequestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",  
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  message:{
    type:String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,  
},
lastname: {
    type: String,
    required: true,
},
  customerID: {
    type: String,
    required: true,
  },
},
{ timestamps: true });

module.exports = mongoose.model("CustomerRedeemRequest", CustomerRedeemRequestSchema);
