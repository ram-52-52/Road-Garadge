const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Garage = require('../models/Garage');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Marketplace Administration & Moderation
 */

/**
 * @swagger
 * /admin/garages:
 *   get:
 *     summary: List all garages for verification
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of garages
 */
router.get('/garages', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const garages = await Garage.find().populate('owner_id', 'name phone');
    res.json({ success: true, data: garages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /admin/garages/{id}/verify:
 *   patch:
 *     summary: Verify a garage partner
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garage verified
 */
router.patch('/garages/:id/verify', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const garage = await Garage.findByIdAndUpdate(req.params.id, { is_verified: true }, { new: true });
    res.json({ success: true, data: garage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /admin/jobs:
 *   get:
 *     summary: Global Audit of all marketplace jobs
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Global job list
 */
router.get('/jobs', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const jobs = await Job.find().populate('driver_id garage_id');
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Platform-Wide Operational Intelligence (GMV, Jobs, Growth)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics payload for Recharts dashboard
 */
router.get('/analytics', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const User = require('../models/User');
    const AVG_JOB_VALUE = 500;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalJobs,
      activeJobs,
      completedJobs,
      totalGarages,
      verifiedGarages,
      totalDrivers,
      monthJobs,
      lastMonthJobs
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: { $in: ['PENDING', 'ACCEPTED', 'EN_ROUTE'] } }),
      Job.countDocuments({ status: 'COMPLETED' }),
      Garage.countDocuments(),
      Garage.countDocuments({ is_verified: true }),
      User.countDocuments({ role: 'DRIVER' }),
      Job.countDocuments({ status: 'COMPLETED', createdAt: { $gte: startOfMonth } }),
      Job.countDocuments({ status: 'COMPLETED', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } })
    ]);

    const gmv = completedJobs * AVG_JOB_VALUE;
    const monthRevenue = monthJobs * AVG_JOB_VALUE;
    const revenueGrowth = lastMonthJobs > 0
      ? (((monthJobs - lastMonthJobs) / lastMonthJobs) * 100).toFixed(1)
      : 100;

    res.json({
      success: true,
      data: {
        gmv,
        total_jobs: totalJobs,
        active_jobs: activeJobs,
        completed_jobs: completedJobs,
        total_garages: totalGarages,
        verified_garages: verifiedGarages,
        total_drivers: totalDrivers,
        month_revenue: monthRevenue,
        revenue_growth: parseFloat(revenueGrowth)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
