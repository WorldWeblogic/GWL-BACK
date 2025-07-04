const express = require("express");
const app = express();
const Manager = require("../models/manager-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Update customer by email with validation
exports.updateManager = async (req, res) => {
  const { managerid } = req.params;
  const { firstname, lastname, email, phone, password } = req.body;

  // Check if all required fields are present
  if (
    !email ||
    !password ||
    !lastname ||
    !firstname ||
    !managerid ||
    !phone
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // Password validation
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
    const customer = await Manager.findOneAndUpdate(
      { managerid },
      {
        firstname: fullname,
        lastname,
        email,
        phone,
        password: hashedPassword,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "manager not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "manager updated successfully.",
      customer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
    //next(err);
  }
};

// get all manager
exports.getallmanager = async (req, res) => {
  try {
    const manager = await Manager.find({ isDeleted: false }).sort({ createdAt: -1, });
    res.status(200).json({
      success: true,
      message: "manager data get",
      manager,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update single Super manager
exports.updatesingleSManager = async (req, res) => {
  try {
    const superManager = await Manager.findById(req.params.id);
    const { firstname, lastname, email } = req.body;

    if (!email || !lastname || !firstname) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    if (!superManager) {
      return res.status(404).json({
        success: false,
        message: "Super Manager not found",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Update fields
    superManager.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
    superManager.lastname = lastname;
    superManager.email = email;

    await superManager.save();

    res.status(200).json({
      success: true,
      message: "Super Manager updated successfully",
      superManager,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// softdelete
exports.softdeletemanager = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Manager.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Manager not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Manager soft delete successfully.",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get single manager
exports.manager = async (req, res) => {
  try {
    const managerdata = await Manager.findById(req.params.id);
    if (!managerdata) {
      return res.status(404).json({
        success: false,
        message: "employee not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "employee data",
      managerdata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.signupManager = async (req, res) => {
  try {
    const { email, password, managerid, phone, firstname, lastname } = req.body;
    if (!email || !password || !managerid || !phone || !firstname || !lastname) {
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

    const userExist = await Manager.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Username already exist",
      });
    }
    // Check if the offer ID already exists
    const existingOffer = await Manager.findOne({ managerid });
    if (existingOffer) {
      return res.status(400).json({ message: "Manager already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
    const newUser = await Manager({
      email,
      password: hashedPassword,
      managerid,
      phone,
      firstname: fullname,
      lastname,
    });

    const payload = {
      userId: newUser?._id,
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    await newUser.save();

    res.cookie("token", token, { httpOnly: true }).status(201).json({
      success: true,
      message: "Manager created successfully",
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

exports.loginManager = async (req, res) => {
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
    const user = await Manager.findOne({ email });
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
      managerId: user?._id,
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true }).status(201).json({
      success: true,
      message: "Manager login successfully",
      token,
      payload,
    });
  } catch (err) {
    next(err);
  }
};


//fetch last added offer ID;
exports.getLastSuperManId = async (req, res) => {
  try {
    const lastSuperMan = await Manager.findOne({})
      .sort({ createdAt:-1 })
      .select("managerid");
    if (!lastSuperMan) {
      return res.status(200).json({
        success: true,
        lastSuperManId: "0",
        message: "No Manager found",
      });
    }

    res.status(200).json({
      success: true,
      lastSuperManId: lastSuperMan.managerid,
      message: "Last Supermanager fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching last Super Manager Id:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// // update single Lower manager
// exports.updatesingleSManager = async (req, res) => {
//   try {
//     const superManager = await Manager.findById(req.params.id);
//     const { firstname, lastname, email } = req.body;

//     if (!email || !lastname || !firstname) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill in all fields",
//       });
//     }

//     if (!superManager) {
//       return res.status(404).json({
//         success: false,
//         message: "Super Manager not found",
//       });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email format",
//       });
//     }

//     // Update fields
//     superManager.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
//     superManager.lastname = lastname;
//     superManager.email = email;

//     await superManager.save();

//     res.status(200).json({
//       success: true,
//       message: "Super Manager updated successfully",
//       superManager,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };