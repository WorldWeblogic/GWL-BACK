const mongoose = require("mongoose");

const pointRequestSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  companyId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["add", "deduct"],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "disapproved"],
    default: "pending",
  },
  manager: {
    type: String,
  },
  managerEmail: {
    type: String
  },
  notification: {
    type: String,
    required: true,
  },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CompanyPoints", pointRequestSchema);
