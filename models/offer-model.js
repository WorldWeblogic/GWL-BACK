const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    managerEmail: {
      type: String
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Delete"],
      default: "Pending",
    },
    manager: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Offer", offerSchema);
