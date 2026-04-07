const Garage = require('../models/Garage');

// @desc    Create a new garage profile
// @route   POST /api/v1/garages
// @access  Private
const createGarage = async (req, res) => {
  try {
    const { name, address, location, services } = req.body;

    // Ensure location is valid [longitude, latitude]
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: 'Invalid location coordinates' });
    }

    const garage = await Garage.create({
      owner_id: req.user._id,
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [location.coordinates[0], location.coordinates[1]], // [lng, lat]
        addressByCoordinates: location.address // Storing the picker's detailed address
      },
      services
    });

    res.status(201).json({ success: true, data: garage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby available garages
// @route   GET /api/v1/garages/nearby
// @access  Private
const getNearbyGarages = async (req, res) => {
  try {
    const { lng, lat, radius = 10 } = req.query; // radius in km

    if (!lng || !lat) {
      return res.status(400).json({ success: false, message: 'Please provide both latitude and longitude' });
    }

    // Convert coordinates to numbers
    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);

    const garages = await Garage.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: radius * 1000, // MongoDB uses meters
          distanceMultiplier: 0.001,  // Convert result distance to km
          query: { is_available: true } // Filter only online garages
        }
      }
    ]);

    res.status(200).json({ success: true, count: garages.length, data: garages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle garage availability (Online/Offline)
// @route   PATCH /api/v1/garages/:id/status
// @access  Private
const toggleAvailability = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id);

    if (!garage) {
      return res.status(404).json({ success: false, message: 'Garage not found' });
    }

    // Ensure only the owner can toggle status
    if (garage.owner_id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this garage' });
    }

    garage.is_available = !garage.is_available;
    await garage.save();

    res.status(200).json({ success: true, data: garage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get paginated job history for a garage
// @route   GET /api/v1/garages/:id/jobs
// @access  Private (Garage Owner or Admin)
const getGarageJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const Job = require('../models/Job');
    const [jobs, total] = await Promise.all([
      Job.find({ garage_id: req.params.id })
        .populate('driver_id', 'name phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments({ garage_id: req.params.id })
    ]);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregated earnings (daily, weekly, monthly)
// @route   GET /api/v1/garages/:id/earnings
// @access  Private (Garage Owner or Admin)
const getGarageEarnings = async (req, res) => {
  try {
    const Job = require('../models/Job');
    const now = new Date();
    const startOfDay   = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now); startOfMonth.setDate(1);

    const baseQuery = { garage_id: req.params.id, status: 'COMPLETED' };

    const [daily, weekly, monthly, total] = await Promise.all([
      Job.countDocuments({ ...baseQuery, createdAt: { $gte: startOfDay } }),
      Job.countDocuments({ ...baseQuery, createdAt: { $gte: startOfWeek } }),
      Job.countDocuments({ ...baseQuery, createdAt: { $gte: startOfMonth } }),
      Job.countDocuments(baseQuery)
    ]);

    // Revenue estimation (₹500 avg per job)
    const AVG_JOB_VALUE = 500;
    res.status(200).json({
      success: true,
      data: {
        jobs_today: daily,    revenue_today: daily * AVG_JOB_VALUE,
        jobs_week: weekly,    revenue_week: weekly * AVG_JOB_VALUE,
        jobs_month: monthly,  revenue_month: monthly * AVG_JOB_VALUE,
        jobs_total: total,    revenue_total: total * AVG_JOB_VALUE
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a garage
// @route   GET /api/v1/garages/:id/reviews
// @access  Public
const getGarageReviews = async (req, res) => {
  try {
    const Review = require('../models/Review');
    const reviews = await Review.find({ garage_id: req.params.id })
      .populate('driver_id', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createGarage,
  getNearbyGarages,
  toggleAvailability,
  getGarageJobs,
  getGarageEarnings,
  getGarageReviews
};
