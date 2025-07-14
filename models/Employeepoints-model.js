const mongoose = require("mongoose");

const pointRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employeeid: {
    type: String,
    required: true,
  },
  type: { type: String, enum: ["add", "deduct"], required: true },
  value: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "disapproved"],
    default: "pending",
  },
  manager: {
    type: String,
  },
  notification: {
    type: String,
    required: true,
  },
  managerEmail: {
    type: String
  },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EmployeePoints", pointRequestSchema)
