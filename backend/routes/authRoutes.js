const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, getMe, completeProfile, refreshToken, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Corporate Authentication & Identity Management
 */

/**
 * @swagger
 * /auth/request-otp:
 *   post:
 *     summary: Initiate secure session via OTP handshake
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *     responses:
 *       200:
 *         description: OTP Handshake successful
 */
router.post('/request-otp', requestOtp);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Confirm OTP Identity & Obtain JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *               otp: { type: string }
 *     responses:
 *       200:
 *         description: JWT Identity artifact issued
 */
router.post('/verify-otp', verifyOtp);

/**
 * @swagger
 * /auth/complete-profile:
 *   post:
 *     summary: Finalize identity (Name & Role Selection)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               role: { type: string, enum: [DRIVER, GARAGE_OWNER] }
 *     responses:
 *       200:
 *         description: Identity artifacts successfully finalized
 */
router.post('/complete-profile', protect, completeProfile);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtain current identity payload
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token: { type: string }
 *     responses:
 *       200:
 *         description: New access token issued
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Terminate session and invalidate refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session terminated
 */
router.post('/logout', protect, logout);

/**
 * @swagger
 * /auth/update-fcm:
 *   patch:
 *     summary: Update FCM device token for push notifications
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fcm_token: { type: string }
 *     responses:
 *       200:
 *         description: FCM token updated successfully
 */
router.patch('/update-fcm', protect, exports.updateFcmToken = require('../controllers/authController').updateFcmToken);

module.exports = router;
