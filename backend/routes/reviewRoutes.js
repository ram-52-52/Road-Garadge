const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Post-Job Feedback & Quality Assurance
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Submit a review for a completed job
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_id: { type: string }
 *               garage_id: { type: string }
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Review submitted successfully
 */
router.post('/', protect, createReview);

module.exports = router;
