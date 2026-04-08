const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addVehicle, getVehicles } = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

router.get('/', protect, getVehicles);
router.post('/', protect, upload.array('documents', 5), addVehicle);

module.exports = router;
