const express = require('express');
const router = express.Router();
const {
  createJob,
  getJob,
  getJobs,
  acceptJob,
  startJob,
  completeJob,
  cancelJob,
  trackJob
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Real-time Vehicle Assistance Lifecycle
 */
router.get('/', protect, getJobs);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new help request
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_type:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *     responses:
 *       201:
 *         description: Job created and dispatched
 */
router.post('/', protect, createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job details
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', protect, getJob);

/**
 * @swagger
 * /jobs/{id}/accept:
 *   patch:
 *     summary: Mechanic accepts the job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mechanic assigned
 */
router.patch('/:id/accept', protect, acceptJob);

/**
 * @swagger
 * /jobs/{id}/start:
 *   patch:
 *     summary: Mechanic is en-route
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status updated to EN_ROUTE
 */
router.patch('/:id/start', protect, startJob);

/**
 * @swagger
 * /jobs/{id}/complete:
 *   patch:
 *     summary: Finalize and complete job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.patch('/:id/complete', protect, completeJob);

/**
 * @swagger
 * /jobs/{id}/cancel:
 *   patch:
 *     summary: Cancel help request
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.patch('/:id/cancel', protect, cancelJob);

/**
 * @swagger
 * /jobs/{id}/track:
 *   post:
 *     summary: Broadcast live GPS coordinates via Socket.io
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Location broadcasted to driver
 */
router.post('/:id/track', protect, trackJob);

module.exports = router;
