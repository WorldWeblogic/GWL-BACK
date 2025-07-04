const express = require("express");
const app = express();
const Admin = require("../models/admin-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signupAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      // If the password format is invalid, return an error response
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number",
      });
    }

    const userExist = await Admin.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Username already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullname=name.charAt(0).toUpperCase()+name.slice(1);
    const newUser = await Admin({
      email,
      password: hashedPassword,
      name:fullname
    });

    const payload = {
      userId: newUser?._id,
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    await newUser.save();

    res.cookie("token", token, { httpOnly: true }).status(201).json({
      success: true,
      message: "admin created successfully",
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

exports.loginAdmin = async (req, res) => {
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      // If the password format is invalid, return an error response
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number",
      });
    }
    const user = await Admin.findOne({ email });
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
      adminId: user?._id,
    };

    let admintoken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", admintoken, { httpOnly: true }).status(201).json({
      success: true,
      message: "admin login successfully",
      admintoken,
      payload,
    });
  } catch (err) {
    //next(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.admin = async (req, res) => {
  try {
    const admindata = await Admin.findById(req.params.id);
    if (!admindata) {
      return res.status(404).json({
        success: false,
        message: "admin not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "admin data",
      admindata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update single admin
exports.updateadmin = async (req, res) => {
  try {
    const admindata = await Admin.findById(req.params.id);
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    if (!admindata) {
      return res.status(404).json({
        success: false,
        message: "employee not found",
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
      // If the password format is invalid, return an error response
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number",
      });
    }
    // Update fields
    admindata.name = name.charAt(0).toUpperCase() + name.slice(1);
    admindata.email = email;
    admindata.password = password;

    await admindata.save();

    res.status(200).json({
      success: true,
      message: "admin data updated successfully",
      admindata
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

