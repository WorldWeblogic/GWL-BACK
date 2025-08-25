const mongoose = require("mongoose");

const RedeemRequestSchema = new mongoose.Schema({
  employee: {
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
  employeeID: {
    type: String,
    required: true,
  },
},
{ timestamps: true });

module.exports = mongoose.model("RedeemRequest", RedeemRequestSchema);
