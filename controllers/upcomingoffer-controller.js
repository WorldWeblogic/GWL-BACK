const upcomingOffer = require("../models/upcomingoffer-model");

// softdelete
exports.upcomingsoftdeleteoffer = async (req, res) => {
  try {
    const userId = req.params.id;
    const offer = await upcomingOffer.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "offer soft delete successfully.",
      offer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update offer by ID with validation
exports.upcomingupdateoffer = async (req, res) => {
  const { offerid } = req.params;
  const { offerTitle, offerDescription, startDate, endDate } = req.body;

  // Check if all required fields are present
  if (!offerTitle || !offerDescription || !startDate || !endDate || !offerid) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields",
    });
  }
  try {
    const offer = await upcomingOffer.findOneAndUpdate(
      { offerid },
      {
        offerDescription,
        offerTitle,
        startDate,
        endDate,
      },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "offer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "offer updated successfully.",
      offer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
    //next(err);
  }
};

// Create a new offer
exports.upcomingcreateOffer = async (req, res) => {
  try {
    const {
      offerTitle,
      offerDescription,
      startDate,
      endDate,
      offerid,
      manager,
    } = req.body;
    // Simple validation
    if (
      !offerTitle ||
      !offerDescription ||
      !startDate ||
      !endDate ||
      !offerid ||
      !manager
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // Check if the offer ID already exists
    const existingOffer = await upcomingOffer.findOne({ offerid });
    if (existingOffer) {
      return res.status(400).json({ message: "Offer ID already exists." });
    }
    const newOffer = new upcomingOffer({
      offerTitle,
      offerDescription,
      startDate,
      endDate,
      offerid,
      manager,
    });

    await newOffer.save();

    res.status(201).json({
      message: "Offer created successfully!",
      newOffer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// get all offers
exports.allupcomingoffer = async (req, res) => {
  try {
    const offer = await upcomingOffer
      .find({ isDeleted: false })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "offer data received",
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get all approve offers
exports.allapproveupcomingoffer = async (req, res) => {
  try {
    const offer = await upcomingOffer
      .find({ isDeleted: false, status: "Approved" })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "offer data received",
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get single customer upcoming offer
exports.getSingleCustomerUpcomingOffer = async (req, res) => {
  try {
    const offerData = await upcomingOffer.findById(req.params.id);
    if (!offerData) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Offer data",
      offerData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// reject Offer
exports.rejectupcomingOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    // Find the Offer first
    const offer = await upcomingOffer.findById(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    // Check if already rejected
    if (offer.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Offer is already rejected.",
      });
    }

    // offer is requested for delete
    if (offer.status === "Delete") {
      return res.status(400).json({
        success: false,
        message: "Offer is requested for delete offer.",
      });
    }

    // Update status to rejected
    offer.status = "Rejected";
    await offer.save();

    res.status(200).json({
      success: true,
      message: "Offer rejected successfully.",
      offer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// approve Offer
exports.approveupcomingOffer = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the Offer first
    const offer = await upcomingOffer.findById(userId);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    // Check if already approved
    if (offer.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Offer is already approved.",
      });
    }

    // offer is requested for delete
    if (offer.status === "Delete") {
      return res.status(400).json({
        success: false,
        message: "Offer is requested for delete offer.",
      });
    }

    // Update status to Approved
    offer.status = "Approved";
    await offer.save();

    res.status(200).json({
      success: true,
      message: "Offer approved successfully.",
      offer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete offer
exports.deleteupcomingOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    // Find the offer first
    const offer = await upcomingOffer.findById(offerId);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "offer not found.",
      });
    }

    // Check if already deleted
    if (offer.status === "Delete") {
      return res.status(400).json({
        success: false,
        message: "Offer is already deleted.",
      });
    }

    // Update status to deleted
    offer.status = "Delete";
    await offer.save();

    res.status(200).json({
      success: true,
      message: "offer delete successfully.",
      offer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


//fetch last added offer ID;
exports.getLastCusOfferId = async (req, res) => {
  try {
    const lastCusOffer = await upcomingOffer.findOne({})
      .sort({ createdAt:-1 })
      .select("offerid");

    if (!lastCusOffer) {
      return res.status(200).json({
        success: true,
        lastCusOfferId: "0",
        message: "No offers found",
      });
    }

    res.status(200).json({
      success: true,
      lastCusOfferId: lastCusOffer.offerid,
      message: "Last offerId fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching last offerId:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

