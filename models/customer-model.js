const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    customerid: {
      type: String,
      required: true,
      unique: true,
    },
    companyId: {
      type: String,
      require: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Delete"],
      default: "Pending",
    },
    manager: {
      type: String,
    },
    managerEmail: {
      type: String,
      required: false,
    },
    company: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
      }
    ],
    // employee: [
    //   {
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref: "Employee",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
