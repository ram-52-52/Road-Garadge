const express = require('express');
const router = express.Router();
const {
  createGarage,
  getNearbyGarages,
  toggleAvailability,
  getGarageJobs,
  getGarageEarnings,
  getGarageReviews
} = require('../controllers/garageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/nearby', getNearbyGarages);
router.post('/', protect, createGarage);
router.patch('/:id/status', protect, toggleAvailability);

/**
 * @swagger
 * /garages/{id}/jobs:
 *   get:
 *     summary: Paginated job history for a garage partner
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: number, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated job list for this garage
 */
router.get('/:id/jobs', protect, getGarageJobs);

/**
 * @swagger
 * /garages/{id}/earnings:
 *   get:
 *     summary: Aggregated revenue breakdown (daily, weekly, monthly)
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Revenue aggregation data
 */
/**
 * @swagger
 * /garages/{id}/reviews:
 *   get:
 *     summary: Fetch all reviews/ratings for a specific garage node
 *     tags: [Garages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of partner reviews
 */
router.get('/:id/reviews', getGarageReviews);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Garages
 *   description: Partner Management & Geo-Spatial Search
 */

/**
 * @swagger
 * /garages/nearby:
 *   get:
 *     summary: Find nearby available garages within 15km sector
 *     tags: [Garages]
 *     parameters:
 *       - in: query
 *         name: lng
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: lat
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: radius
 *         schema: { type: number, default: 15 }
 *     responses:
 *       200:
 *         description: List of nearby verified garages
 */
router.get('/nearby', getNearbyGarages);

/**
 * @swagger
 * /garages:
 *   post:
 *     summary: Register/Onboard a new garage partner node
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Garage profile initialized
 */
router.post('/', protect, createGarage);

/**
 * @swagger
 * /garages/{id}/status:
 *   patch:
 *     summary: Toggle garage operational availability (Online/Offline)
 *     tags: [Garages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Availability status successfully transitioned
 */
router.patch('/:id/status', protect, toggleAvailability);

module.exports = router;
