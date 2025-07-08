// File: controllers/Company-controller.js
const express = require("express");
const Company = require("../models/Company-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const PointRequest = require("../models/Companypoints-model");
const Employee = require("../models/employee-model");

exports.requestcompanypoints = async (req, res) => {
  try {
    const { companyId, type, value, manager, notification } = req.body;

    if (!type || !value || !manager || !notification) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details",
      });
    }

    const points = Number(value);
    if (isNaN(points) || points < 0) {
      return res.status(400).json({
        success: false,
        message: "Points must be a valid non-negative number",
      });
    }

    const company = await Company.findOne({ companyId });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const request = new PointRequest({
      company: company._id,
      companyId,
      type,
      manager,
      value: points,
      notification,
    });

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request submitted for admin approval.",
      request,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.companypointsreview = async (req, res) => {
  try {
    const { approved } = req.body;
    const request = await PointRequest.findById(req.params.id);

    if (!request || request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Invalid or already processed request.' });
    }

    if (approved) {
      const company = await Company.findById(request.company);
      if (!company) return res.status(404).json({ message: 'company not found' });

      if (request.type === 'add') {
        company.points += request.value;

        const TROPHY_TIERS = [
          { color: 'gold', points: 3000 },
          { color: 'silver', points: 1000 },
          { color: 'blue', points: 300 },
        ];

        function getCurrentTrophy(points) {
          for (let tier of TROPHY_TIERS) {
            if (points >= tier.points) return tier.color;
          }
          return null;
        }

        const now = new Date();
        const newTrophy = getCurrentTrophy(company.points);
        if (company.trophy) {
          const expiry = new Date(company.trophyDate);
          expiry.setFullYear(expiry.getFullYear() + 1);

          if (now > expiry) {
            company.trophy = newTrophy;
            company.trophyDate = newTrophy ? now : null;
          } else {
            const currentTierIndex = TROPHY_TIERS.findIndex(t => t.color === company.trophy);
            const newTierIndex = TROPHY_TIERS.findIndex(t => t.color === newTrophy);
            if (newTrophy && newTierIndex < currentTierIndex) {
              company.trophy = newTrophy;
              company.trophyDate = now;
            }
          }
        } else if (newTrophy) {
          company.trophy = newTrophy;
          company.trophyDate = now;
        }
      } else {
        company.points = Math.max(0, company.points - request.value);
      }

      await company.save();
      request.status = 'approved';
      request.message = 'Request approved and points updated.';
    } else {
      request.status = 'disapproved';
      request.message = 'Request disapproved. No changes made.';
    }

    await request.save();
    res.status(200).json({
      success: true,
      message: request.message,
      request,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.allcompanyrequest = async (req, res) => {
  try {
    const requests = await PointRequest.find().populate({
      path: 'company',
      match: { status: 'Approved', isDeleted: false },
    });
    res.status(200).json({ success: true, message: "get all request", requests });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// reject company
exports.rejectcompany = async (req, res) => {
  try {
    const compId = req.params.id;

    // Find the company first
    const company = await Company.findById(compId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // Update status to rejected
    company.status = 'Rejected';
    await company.save();

    res.status(200).json({
      success: true,
      message: "company rejected successfully.",
      company,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// approve company
exports.approvecompany = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the company first
    const company = await Company.findById(userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "company not found.",
      });
    }

    // Check if already approved
    if (company.status === 'Approved') {
      return res.status(400).json({
        success: false,
        message: "company is already approved.",
      });
    }

    // Update status to Approved
    company.status = 'Approved';
    await company.save();

    res.status(200).json({
      success: true,
      message: "company approved successfully.",
      company,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete company
exports.deletecompany = async (req, res) => {
  try {
    const compId = req.params.id;
    // Find the company first
    const company = await Company.findById(compId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "company not found.",
      });
    }

    // Update status to deleted
    company.status = 'Delete';
    await company.save();

    res.status(200).json({
      success: true,
      message: "company delete successfully.",
      company,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.CreateCompany = async (req, res) => {
  try {
    const { companyId, name, manager, email, phone, companyaddress, employeeid, emetID, managerEmail } = req.body;
    const pdf1Path = req.files?.pdf1?.[0]
      ? `/uploads/companypdfs/${req.files.pdf1[0].filename}`
      : null;

    if (!companyId || !name || !manager || !email || !phone || !companyaddress || !employeeid) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    const existing = await Company.findOne({ $or: [{ companyId }, { email }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "Company already exists" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const employee = await Employee.findOne({ employeeid, status: "Approved", isDeleted: false });
    if (!employee) {
      return res.status(400).json({ success: false, message: "Employee not found or not eligible" });
    }

    const company = new Company({
      name,
      companyId,
      manager,
      email,
      phone,
      companyaddress,
      employeeid: employeeid,
      employee: employee._id,
      pdf1Path,
      emetID: emetID,
      managerEmail: managerEmail
    });

    let token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    employee.company.addToSet(company._id);
    await employee.save();
    await company.save();

    return res.cookie("token", token).status(201).json({
      success: true,
      message: "Company created successfully",
      token,
      newCompany: company,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// soft delete company 
exports.softdeletecompany = async (req, res) => {
  try {
    const Id = req.params.id;
    const company = await Company.findByIdAndUpdate(
      Id,
      { isDeleted: true },
      { new: true }
    );
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "company not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "company soft delete successfully.",
      company,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get all company
exports.getallcompany = async (req, res) => {
  try {
    const company = await Company.find({ isDeleted: false })
      .populate({
        path: "employee",
        match: { isDeleted: false, status: "Approved" }
      })
      .populate({
        path: "customers",
        match: { isDeleted: false, status: "Approved" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Company data fetched successfully",
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updatecompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { name, companyaddress, email, phone, employeeid } = req.body;

    // Validate fields
    if (!name || !companyaddress || !email || !phone || !employeeid) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    // Find the existing company
    const company = await Company.findOne({ companyId });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const oldEmployeeId = company.employeeid;

    // If employee ID is changed, update relationships
    if (oldEmployeeId !== employeeid) {
      const oldEmployee = await Employee.findOne({ employeeid: oldEmployeeId });
      const newEmployee = await Employee.findOne({ employeeid });

      if (!newEmployee) {
        return res.status(400).json({
          success: false,
          message: "New employee not found",
        });
      }

      // Remove company from old employee
      if (oldEmployee) {
        oldEmployee.company.pull(company._id);
        await oldEmployee.save();
      }

      // Add company to new employee
      newEmployee.company.addToSet(company._id);
      await newEmployee.save();

      // Update company reference
      company.employeeid = employeeid;
      company.employee = newEmployee._id;
    }

    // Update text fields
    company.name = name;
    company.companyaddress = companyaddress;
    company.email = email;
    company.phone = phone;

    // Handle updated PDF files (if any)
    const pdf1Path = req.files?.pdf1?.[0]
      ? `/uploads/companypdfs/${req.files.pdf1[0].filename}`
      : null;

    if (pdf1Path) {
      company.pdf1Path = pdf1Path;
    }

    // Save updated company
    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      company,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// get single Company data
exports.getCompany = async (req, res) => {
  try {
    const compData = await Company.findById(req.params.id)
    if (!compData) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Company data",
      compData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// get last added company Id
exports.getLastComId = async (req, res) => {
  try {
    const lastComId = await Company.findOne({})
      .sort({ createdAt: -1 })
      .select("companyId");

    if (!lastComId) {
      return res.status(200).json({
        success: true,
        lastComId: "0",
        message: "No Company found",
      });
    }

    res.status(200).json({
      success: true,
      lastComId: lastComId.companyId,
      message: "Last Company fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching last Company Id:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getEID = async (req, res) => {
  try {
    let unique = false;
    let newId;

    while (!unique) {
      newId = "";
      for (let i = 0; i < 12; i++) {
        newId += Math.floor(Math.random() * 10);
      }

      const existing = await Company.findOne({ emetID: newId });
      if (!existing) {
        unique = true;
      }
    }

    return res.status(200).json({
      success: true,
      emetID: newId,
      message: "Random unique company ID generated",
    });

  } catch (error) {
    console.error("Error generating random company ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}