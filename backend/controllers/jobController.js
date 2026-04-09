const Job = require('../models/Job');
const Garage = require('../models/Garage');
const socketService = require('../services/socketService');
const JobTracking = require('../models/JobTracking');

// @desc    Create and dispatch a new job
// @route   POST /api/v1/jobs
// @access  Private (Driver Only)
const createJob = async (req, res) => {
  try {
    const { services, description, location } = req.body;

    const job = await Job.create({
      driver_id: req.user._id,
      services,
      description,
      location: {
        type: 'Point',
        coordinates: [location.coordinates[0], location.coordinates[1]],
        address: location.address
      }
    });

    // Matchmaking: Find garages within 15km that handle ALL requested services
    const nearbyGarages = await Garage.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [location.coordinates[0], location.coordinates[1]] },
          $maxDistance: 15000
        }
      },
      is_available: true,
      "services.service_type": { $all: services }
    });

    // Fetch full job with populated user details for dispatch
    const populatedJob = await Job.findById(job._id).populate('driver_id', 'name phone');
    
    // Dispatch job to nearby mechanics (Socket + FCM)
    socketService.handleNewJob(req.io, req.connectedUsers, populatedJob, nearbyGarages);

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job details
// @route   GET /api/v1/jobs/:id
// @access  Private
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('driver_id', 'name phone').populate('garage_id', 'name location owner_id');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept a job (Mechanic)
// @route   PATCH /api/v1/jobs/:id/accept
const acceptJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Job taken/cancelled' });

    // 1. Find the mechanic's garage
    const mechanicGarage = await Garage.findOne({ owner_id: req.user._id });
    if (!mechanicGarage) {
      return res.status(404).json({ success: false, message: 'Your garage profile was not found' });
    }

    job.status = 'ACCEPTED';
    job.garage_id = mechanicGarage._id;
    await job.save();

    // Populate for clean frontend handshake
    const populatedJob = await Job.findById(job._id)
      .populate('driver_id', 'name phone')
      .populate('garage_id', 'name location owner_id');

    // Signal instantly to Driver (Socket + Status Broadcast)
    socketService.handleJobAccepted(req.io, req.connectedUsers, populatedJob);

    res.status(200).json({ success: true, data: populatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start travel to location (Mechanic)
// @route   PATCH /api/v1/jobs/:id/start
const startJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    
    // Security check: Only the assigned mechanic can start
    const mechanicGarage = await Garage.findOne({ owner_id: req.user._id });
    if (!mechanicGarage || job.garage_id.toString() !== mechanicGarage._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    job.status = 'EN_ROUTE';
    await job.save();

    // Broadcast Status Update
    socketService.handleStatusUpdate(req.io, req.connectedUsers, job, 'EN_ROUTE');

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Finalize and complete job (Mechanic)
// @route   PATCH /api/v1/jobs/:id/complete
const completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    
    const mechanicGarage = await Garage.findOne({ owner_id: req.user._id });
    if (!mechanicGarage || job.garage_id.toString() !== mechanicGarage._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    job.status = 'COMPLETED';
    await job.save();

    // Notify Parties
    socketService.handleStatusUpdate(req.io, req.connectedUsers, job, 'COMPLETED');

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel job (Driver or Mechanic)
// @route   PATCH /api/v1/jobs/:id/cancel
const cancelJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Security: Only related parties can cancel
    const mechanicGarage = await Garage.findOne({ owner_id: req.user._id });
    const isDriver = job.driver_id.toString() === req.user._id.toString();
    const isMechanic = job.garage_id && mechanicGarage && (job.garage_id.toString() === mechanicGarage._id.toString());
    
    if (!isDriver && !isMechanic) {
        return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    job.status = 'CANCELLED';
    await job.save();

    // Notify other party
    socketService.handleStatusUpdate(req.io, req.connectedUsers, job, 'CANCELLED');

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Broadcast live GPS coordinates (Mechanic)
// @route   POST /api/v1/jobs/:id/track
const trackJob = async (req, res) => {
    try {
        const { coordinates } = req.body; // [lng, lat]
        const job = await Job.findById(req.params.id);
        
        if (!job || job.status !== 'EN_ROUTE') {
            return res.status(400).json({ success: false, message: 'Tracking only available when moving' });
        }

        // Update last known location in the main Job document for persistence
        job.mechanic_location = {
            type: 'Point',
            coordinates
        };
        await job.save();

        // Persist to Breadcrumb Trail for historical auditing
        await JobTracking.create({
            job_id: req.params.id,
            location: {
                type: 'Point',
                coordinates
            }
        });

        // Broadcast to driver via Socket.io
        req.io.to(req.connectedUsers.get(job.driver_id.toString())).emit('mechanic:location', {
            jobId: job._id,
            coordinates
        });

        res.status(200).json({ success: true, message: 'Location broadcasted and persisted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get job history for the authenticated user
// @route   GET /api/v1/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const mechanicGarage = await Garage.findOne({ owner_id: req.user._id });
    const query = {
      $or: [
        { driver_id: req.user._id },
        { garage_id: mechanicGarage?._id }
      ]
    };

    const jobs = await Job.find(query)
      .populate('driver_id', 'name phone')
      .populate('garage_id', 'name location owner_id')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createJob,
  getJob,
  getJobs,
  acceptJob,
  startJob,
  completeJob,
  cancelJob,
  trackJob
};
