const express = require('express');
const router = express.Router();
const {
  createGarage,
  getMyGarage,
  getNearbyGarages,
  toggleAvailability,
  getGarageJobs,
  getGarageEarnings,
  getGarageReviews,
  updateGarageProfile,
  deleteGarageProfile
} = require('../controllers/garageController');
const { protect } = require('../middleware/authMiddleware');

// Public Search
router.get('/nearby', getNearbyGarages);
router.get('/:id/reviews', getGarageReviews);

// Partner Operations
router.post('/', protect, createGarage);
router.get('/profile', protect, getMyGarage);
router.patch('/profile', protect, updateGarageProfile);
router.delete('/profile', protect, deleteGarageProfile);
router.patch('/:id/status', protect, toggleAvailability);

// Partner Analytics
router.get('/:id/jobs', protect, getGarageJobs);
router.get('/:id/earnings', protect, getGarageEarnings);

module.exports = router;
