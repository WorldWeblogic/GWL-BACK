const express = require("express");
const app = express();
const Customer = require("../models/customer-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Company = require("../models/Company-model");


// get all customer
exports.getallcustomer = async (req, res) => {
  try {
    const customer = await Customer.find({ isDeleted: false }).populate("company").sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: "customer data get",
      customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

// update single customer
exports.updatesinglecustomer = async (req, res) => {
  try {
    const userdata = await Customer.findById(req.params.id);
    const { firstname, lastname, password } = req.body;

    if (!password || !lastname || !firstname) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    if (!userdata) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  }
   const hashedPassword = await bcrypt.hash(password, 10);
    // Update fields
    userdata.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
    userdata.lastname = lastname;
    userdata.password = hashedPassword;

    await userdata.save();

    res.status(200).json({
      success: true,
      message: "User data updated successfully",
      updatedUser: userdata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// softdelete
exports.softdeletecustomer = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Customer.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "customer soft delete successfully.",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// reject customer
exports.rejectcustomer = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the customer first
    const user = await Customer.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // Update status to rejected
    user.status = 'Rejected';
    await user.save();

    res.status(200).json({
      success: true,
      message: "Customer rejected successfully.",
      user,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// approve customer
exports.approvecustomer = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the customer first
    const user = await Customer.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // Check if already approved
    if (user.status === 'Approved') {
      return res.status(400).json({
        success: false,
        message: "Customer is already approved.",
      });
    }

    // Update status to Approved
    user.status = 'Approved';
    await user.save();

    res.status(200).json({
      success: true,
      message: "Customer approved successfully.",
      user,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const custId = req.params.id;
    // Find the customer first
    const customer = await Customer.findById(custId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // Update status to deleted
    customer.status = 'Delete';
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Customer delete successfully.",
      customer,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// update customer by manager 
exports.updateCustomer = async (req, res) => {
  const { customerid } = req.params;
  const { firstname, lastname, email, companyId, password } = req.body;

  if ( !email ||!password ||!lastname || !firstname ||!customerid || !companyId) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullname = firstname.charAt(0).toUpperCase() + firstname.slice(1);

    const customer = await Customer.findOne({ customerid });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // update company
    const oldCompany = await Company.findOne({ companyId: customer.companyId });
    const newCompany = await Company.findOne({ companyId });

    if (!newCompany) {
      return res.status(400).json({
        success: false,
        message: "New company not found",
      });
    }

    if (customer.companyId !== companyId) {
      if (oldCompany) {
        oldCompany.customers.pull(customer._id);
        await oldCompany.save();
      }

      newCompany.customers.addToSet(customer._id); // avoid duplicates
      await newCompany.save();
    }

    // Update the customer details
    customer.firstname = fullname;
    customer.lastname = lastname;
    customer.email = email;
    customer.password = hashedPassword;
    customer.companyId= companyId;

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      customer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// create new customer
exports.signup = async (req, res) => {
  try {
    const { lastname, customerid, companyId, firstname, email, password, manager } = req.body;

    if (!email ||!password ||!lastname ||!firstname ||!customerid ||!companyId ||!manager) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase, one lowercase, one number, and one special character",
      });
    }

    const userExist = await Customer.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Check if the customer ID already exists
    const existingcustomer = await Customer.findOne({ customerid });
    if (existingcustomer) {
      return res.status(400).json({ message: "Customer already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullname = firstname.charAt(0).toUpperCase() + firstname.slice(1);

    // customer will not created if company not exist
    const existingcompany = await Company.findOne({ companyId });
    if (!existingcompany) {
      return res.status(400).json({
        success: false,
        message: "Company not found",
      });
    }

    const newUser = new Customer({
      firstname: fullname,
      lastname,
      customerid,
      email,
      manager,
      company: existingcompany._id,
      password: hashedPassword,
    });

    let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Check if the customer already exists in the company's customers array
    if (existingcompany.customers.includes(newUser._id)) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists in this company's customers list",
      });
    }
    // Add the new user to the company customers array
    existingcompany.customers.push(newUser._id);
    await existingcompany.save();

    await newUser.save();
    return res.cookie("token", token).status(201).json({
      success: true,
      message: "User created successfully",
      token,
      newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// login customer
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    if (!emailRegex.test(email)) {
      // If the email format is invalid, return an error response
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/ &&
      /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/;
    if (!passwordRegex.test(password)) {
      // If the password format is invalid, return an error response
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 3 characters long and contain at least one letter, one symbol and one number",
      });
    }
    const user = await Customer.findOne({ email,status:"Approved" });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    const payload = {
      userId: user?._id,
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token).status(201).json({
      success: true,
      message: "User login successfully",
      token,
      payload,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get single user data
exports.user = async (req, res) => {
  try {
    const userdata = await Customer.findById(req.params.id)
      .populate("company");
    if (!userdata) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "user data",
      userdata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// get last added customer Id
exports.getLastCusId = async (req, res) => {
  try {
    const lastCusId = await Customer.findOne({})
      .sort({ createdAt:-1 })
      .select("customerid");

    if (!lastCusId) {
      return res.status(200).json({
        success: true,
        lastCusId: "0",
        message: "No Customer found",
      });
    }

    res.status(200).json({
      success: true,
      lastCusId: lastCusId.customerid,
      message: "Last Customer fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching last Customer Id:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};