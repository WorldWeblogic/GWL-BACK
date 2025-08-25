const RedeemRequest = require("../models/empRedeempoint-model.js");

// Employee sends redeem request
const createRedeemRequest = async (req, res) => {
  try {
    const { value, employeeid, message, firstname, lastname, employeeID } =
      req.body;

    const newRequest = new RedeemRequest({
      employee: employeeid,
      points: value,
      message: message,
      firstname: firstname,
      lastname: lastname,
      employeeID: employeeID,
    });
    await newRequest.save();
    res
      .status(201)
      .json({ message: "Redeem request sent to manager", request: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRedeemRequest = async (req, res) => {
  try {
    const { id } = req.params;  // get id from URL params
    const request = await RedeemRequest.find({employee:id}).sort({ createdAt: -1 });

    if (!request) {
      return res.status(400).json({ 
        message: "Redeem request not found", 
        success: false 
      });
    }
    res.status(200).json({
      message: "Redeem request fetched successfully",
      request,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};


module.exports = {
  createRedeemRequest,
  getRedeemRequest,
};