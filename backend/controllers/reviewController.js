const Review = require('../models/Review');
const Job = require('../models/Job');
const Garage = require('../models/Garage');

// @desc    Create a review for a completed job
// @route   POST /api/v1/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { job_id, garage_id, rating, comment } = req.body;

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure job is finished
    if (job.status !== 'COMPLETED' && job.status !== 'PAID') {
      return res.status(400).json({ success: false, message: 'Review can only be submitted for completed/paid jobs' });
    }

    const review = await Review.create({
      job_id,
      driver_id: req.user._id,
      garage_id,
      rating,
      comment
    });

    // Update Garage Rating
    const reviews = await Review.find({ garage_id });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Garage.findByIdAndUpdate(garage_id, {
      rating: parseFloat(avgRating.toFixed(1))
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview };
