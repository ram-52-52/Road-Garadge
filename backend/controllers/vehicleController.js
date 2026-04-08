const Vehicle = require('../models/Vehicle');

// @desc    Add a new vehicle to the vault
// @route   POST /api/v1/vehicles
// @access  Private
const addVehicle = async (req, res) => {
  try {
    const { type, make, model } = req.body;
    
    // Parse documents from uploaded files (Multer)
    let documents = [];
    if (req.files) {
      documents = req.files.map(file => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`
      }));
    }

    const vehicle = await Vehicle.create({
      ownerId: req.user._id,
      type,
      make,
      model,
      documents
    });

    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's vehicle vault
// @route   GET /api/v1/vehicles
// @access  Private
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user._id });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addVehicle,
  getVehicles
};
