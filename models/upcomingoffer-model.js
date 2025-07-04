const mongoose = require("mongoose");

const upcomingofferSchema = new mongoose.Schema(
  {
    offerTitle: {
      type: String,
      required: true,
    },
    offerDescription: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    offerid: {
      type: String,
      required: true,
      unique: true,
    },
    status:{
      type:String,
      enum:["Pending","Approved","Rejected","Delete"],
      default:"Pending",
    },
    manager:{
      type:String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("upcomingOffer", upcomingofferSchema);
