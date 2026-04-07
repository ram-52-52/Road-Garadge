const Razorpay = require('razorpay');
const crypto = require('crypto');
const Job = require('../models/Job');
const Garage = require('../models/Garage');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/v1/payments/order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { job_id, amount } = req.body;

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_job_${job_id}`
    };

    const order = await razorpay.orders.create(options);

    job.razorpay_order_id = order.id;
    job.amount = amount;
    await job.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/v1/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, job_id } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const job = await Job.findById(job_id);
      job.razorpay_payment_id = razorpay_payment_id;
      job.razorpay_signature = razorpay_signature;
      job.status = 'PAID';
      await job.save();

      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get garage earnings aggregation
// @route   GET /api/v1/payments/earnings
// @access  Private (Garage Owners)
const getGarageEarnings = async (req, res) => {
  try {
    // Find the garage owned by the current user
    const garage = await Garage.findOne({ owner_id: req.user._id });
    if (!garage) {
      return res.status(404).json({ success: false, message: 'Garage profile not found' });
    }

    const earnings = await Job.aggregate([
      {
        $match: {
          garage_id: req.user._id, // Comparing with the user ID who accepted the job
          status: 'PAID'
        }
      },
      {
        $group: {
          _id: "$garage_id",
          totalEarnings: { $sum: "$amount" },
          totalJobs: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: earnings[0] || { totalEarnings: 0, totalJobs: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getGarageEarnings
};
