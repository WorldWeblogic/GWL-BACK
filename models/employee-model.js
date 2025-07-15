const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    message: [
      {
        type: String,
        default: "",
      }
    ],
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    employeeid: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    docSales: {
      type: Number,
      default: 0,
    },
    transportSales: {
      type: Number,
      default: 0,
    },
    serviceSales: {
      type: Number,
      default: 0,
    },
    handlingSales: {
      type: Number,
      default: 0,
    },
    freightSales: {
      type: Number,
      default: 0,
    },
    servicesold: {
      type: String,
      default: "",
    },
    newCustomer: {
      type: Number,
      default: 0,
    },
    newCustomerSales: {
      type: Number,
      default: 0,
    },
    digitalTraining: {
      type: Boolean,
      default: false,
    },
    bookRead: {
      type: Boolean,
      default: false,
    },
    csrProgram: {
      type: Boolean,
      default: false,
    },
    marketingMaterials: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    TotalPoints: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
    },
    company: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
