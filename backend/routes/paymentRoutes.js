const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getGarageEarnings
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/earnings', getGarageEarnings);

module.exports = router;
