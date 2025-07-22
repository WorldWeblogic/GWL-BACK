const mongoose = require("mongoose");

const SaleFormSchema = new mongoose.Schema(
  {
    empid: {
      type: String
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
      type: Number,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("SaleForm", SaleFormSchema);
