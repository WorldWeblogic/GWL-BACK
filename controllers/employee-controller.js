const express = require("express");
const app = express();
const Employee = require("../models/employee-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const PointRequest = require("../models/Employeepoints-model");

// Manager requests to add/deduct points
exports.requestpoints = async (req, res) => {
  try {
    const { employeeid, type, value, manager, notification, managerEmail } = req.body;
    if (!type || !value || !manager || !notification) {
      return res.status(400).json({
        success: false,
        message: "Please provide details",
      });
    }

    // Convert points to number
    const points = Number(value);
    if (isNaN(points) || points < 0) {
      return res.status(400).json({
        success: false,
        message: "Points must be a valid non-negative number",
      });
    }
    const employee = await Employee.findOne({ employeeid });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "employee not found",
      });
    }

    const request = new PointRequest({
      employee: employee._id,
      employeeid,
      type,
      manager,
      value: points,
      notification,
      managerEmail: managerEmail
    })


    await request.save();

    res.status(200).json({
      success: true,
      message: "Request submitted for admin approval.",
      request,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Admin approves or disapproves request
exports.pointsreview = async (req, res) => {
  try {
    const { approved } = req.body;
    const request = await PointRequest.findById(req.params.id);

    if (!request || request.status !== "pending") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or already processed request.",
        });
    }

    if (approved) {
      const employee = await Employee.findById(request.employee);
      if (!employee)
        return res.status(404).json({ message: "employee not found" });

      if (request.type === "add") {
        employee.TotalPoints += request.value;
      } else {
        employee.TotalPoints = Math.max(
          0,
          employee.TotalPoints - request.value
        );
      }

      if (request.notification) {
        employee.message.push(request.notification);
      }
      await employee.save();
      request.status = "approved";
      request.message = "Request approved and points updated.";
    } else {
      request.status = "disapproved";
      request.message = "Request disapproved. No changes made.";
    }

    await request.save();
    res.status(200).json({
      success: true,
      message: request.message,
      request,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all requests
exports.allrequest = async (req, res) => {
  try {
    const requests = await PointRequest.find().populate({
      path: "employee",
      match: { status: "Approved", isDeleted: false },
    });
    res.status(200).json({
      success: true,
      message: "get all request",
      requests,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


exports.monthlysaleform = async (req, res) => {
  try {
    const data = req.body;
    const employeeId = req.params.id;

    // Calculate points
    let points = 0;
    if (data.serviceSales >= 1000) points += 2;
    if (data.monthlySales >= 10000) points += 10;
    if (data.docSales >= 100) points += 10;
    if (data.transportSales >= 100) points += 10;
    if (data.handlingSales >= 100) points += 10;
    if (data.freightSales >= 60) points += 10;
    if (data.newCustomerSales >= 10000) points += 50;
    if (data.employeeQuarter === "yes") points += 10;
    if (data.digitalTraining === "yes") points += 20;
    if (data.bookRead === "yes") points += 20;
    if (data.marketingMaterial > 0) points += data.marketingMaterial * 6;
    if (data.csrCompleted === "yes") points += 20;

    // Prepare update object
    const updateData = {
      docSales: data.docSales,
      transportSales: data.transportSales,
      serviceSales: data.serviceSales,
      handlingSales: data.handlingSales,
      freightSales: data.freightSales,
      servicesold: data.servicesold,
      newCustomer: data.newCustomer,
      newCustomerSales: data.newCustomerSales,
      digitalTraining: data.digitalTraining,
      bookRead: data.bookRead,
      csrProgram: data.csrProgram,
      marketingMaterials: data.marketingMaterials,
      points: points,
    };

    // Update employee by ID
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Monthly sales data updated successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// softdelete
exports.softdeleteemployee = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Employee.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "employee not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "employee soft delete successfully.",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get single employee
exports.employee = async (req, res) => {
  try {
    const employeedata = await Employee.findById(req.params.id);
    if (!employeedata) {
      return res.status(404).json({
        success: false,
        message: "employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "employee data",
      employeedata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get all employee
exports.getallemployee = async (req, res) => {
  try {
    const employees = await Employee.find({ isDeleted: false })
      .populate({
        path: "company",
        match: { isDeleted: false, status: "Approved" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Employee data fetched successfully",
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getleaderboard = async (req, res) => {
  try {

    const employees = await Employee.find({ isDeleted: false, status: "Approved" }).sort({ TotalPoints: -1 });

    res.status(200).json({
      success: true,
      message: "Employee data fetched successfully",
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update employee by email with validation
exports.updateEmployee = async (req, res) => {
  const { employeeid } = req.params;
  const { firstname, lastname, email, password, phone } = req.body;

  // Check if all required fields are present
  if (!email || !password || !lastname || !firstname || !employeeid || !phone) {
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
    const employee = await Employee.findOneAndUpdate(
      { employeeid },
      {
        firstname: fullname,
        lastname,
        email,
        phone,
        password: hashedPassword,
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "employee not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "employee updated successfully.",
      employee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// reject employee
exports.rejectEmp = async (req, res) => {
  try {
    const empId = req.params.id;

    // Find the employee first
    const emp = await Employee.findById(empId);

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Update status to rejected
    emp.status = "Rejected";
    await emp.save();

    res.status(200).json({
      success: true,
      message: "Employee rejected successfully.",
      emp,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// approve employee
exports.approveEmp = async (req, res) => {
  try {
    const empID = req.params.id;

    // Find the employee first
    const emp = await Employee.findById(empID);

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Check if already approved
    if (emp.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Employee is already approved.",
      });
    }

    // Update status to Approved
    emp.status = "Approved";
    await emp.save();

    res.status(200).json({
      success: true,
      message: "Employee approved successfully.",
      emp,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete customer
exports.deleteEmp = async (req, res) => {
  try {
    const empId = req.params.id;
    // Find the employee first
    const emp = await Employee.findById(empId);

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Update status to deleted
    emp.status = "Delete";
    await emp.save();

    res.status(200).json({
      success: true,
      message: "Employee delete successfully.",
      emp,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// create new employee
exports.signupEmployee = async (req, res) => {
  try {
    const { email, password, firstname, lastname, employeeid, phone, manager, managerEmail } =
      req.body;
    if (
      !email ||
      !password ||
      !firstname ||
      !lastname ||
      !employeeid ||
      !phone ||
      !manager
    ) {
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

    const userExist = await Employee.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Username already exist",
      });
    }
    const emplidexist = await Employee.findOne({ employeeid });
    if (emplidexist) {
      return res.status(400).json({
        success: false,
        message: "Employee already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
    const newUser = await Employee({
      email,
      password: hashedPassword,
      firstname: fullname,
      lastname,
      employeeid,
      phone,
      manager,
      managerEmail: managerEmail
    });
    let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //let token = jwt.sign( process.env.JWT_SECRET, { expiresIn: "7d" });
    await newUser.save();

    res.cookie("token", token, { httpOnly: true }).status(201).json({
      success: true,
      message: "Employee created successfully",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// login employee
exports.loginEmployee = async (req, res) => {
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
    const user = await Employee.findOne({ email, status: "Approved" });
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
      employeeId: user?._id,
    };

    let employeetoken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", employeetoken, { httpOnly: true }).status(201).json({
      success: true,
      message: "Employee login successfully",
      employeetoken,
      payload,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
    //next(err);
  }
};

// update single employee
exports.updatesingleemployee = async (req, res) => {
  try {
    const userdata = await Employee.findById(req.params.id);
    const { firstname, lastname, password, phone } = req.body;

    if (!password || !lastname || !firstname || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    if (!userdata) {
      return res.status(404).json({
        success: false,
        message: "employee not found",
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
    userdata.phone = phone;

    await userdata.save();

    res.status(200).json({
      success: true,
      message: "employee data updated successfully",
      updatedemployee: userdata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get last added employee Id
exports.getLastEmpId = async (req, res) => {
  try {
    const lastEmpId = await Employee.findOne({})
      .sort({ createdAt: -1 })
      .select("employeeid");

    if (!lastEmpId) {
      return res.status(200).json({
        success: true,
        lastEmpId: "0",
        message: "No Customer found",
      });
    }

    res.status(200).json({
      success: true,
      lastEmpId: lastEmpId.employeeid,
      message: "Last Employee fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching last Employee Id:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};