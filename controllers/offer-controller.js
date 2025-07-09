const Offer = require("../models/offer-model");

// soft delete
exports.softdeleteoffer = async (req, res) => {
  try {
    const userId = req.params.id;
    const offer = await Offer.findByIdAndUpdate(
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

// reject Offer
exports.rejectOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    // Find the Offer first
    const offer = await Offer.findById(offerId);
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
exports.approveOffer = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the Offer first
    const offer = await Offer.findById(userId);

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
exports.deleteOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    // Find the offer first
    const offer = await Offer.findById(offerId);

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

// Update offer by ID with validation
exports.updateoffer = async (req, res) => {
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
    const offer = await Offer.findOneAndUpdate(
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
exports.createOffer = async (req, res) => {
  try {
    const {
      offerTitle,
      offerDescription,
      startDate,
      endDate,
      offerid,
      manager,
      managerEmail
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
    const existingOffer = await Offer.findOne({ offerid });
    if (existingOffer) {
      return res.status(400).json({ message: "Offer ID already exists." });
    }
    const newOffer = new Offer({
      offerTitle,
      offerDescription,
      startDate,
      endDate,
      offerid,
      manager,
      managerEmail: managerEmail
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
exports.getalloffer = async (req, res) => {
  try {
    const offer = await Offer.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
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
exports.getapproveoffer = async (req, res) => {
  try {
    const offer = await Offer.find({
      isDeleted: false,
      status: "Approved"
    }).sort({ createdAt: -1 });
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

// get single customer offer
exports.getSingleCustomerOffer = async (req, res) => {
  try {
    const offerData = await Offer.findById(req.params.id);
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


//fetch last added offer ID;
exports.getLastOfferId = async (req, res) => {
  try {
    const lastOffer = await Offer.findOne({})
      .sort({ createdAt: -1 })
      .select("offerid");

    if (!lastOffer) {
      return res.status(200).json({
        success: true,
        lastOfferId: "0",
        message: "No offers found",
      });
    }

    res.status(200).json({
      success: true,
      lastOfferId: lastOffer.offerid,
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
