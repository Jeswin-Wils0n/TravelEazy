const express = require('express');
const { 
  getAllPackages, 
  getPackage, 
  createPackage, 
  updatePackage, 
  deletePackage,
  getPackageStats
} = require('../controllers/packageController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getAllPackages);
router.get('/:id', getPackage);

router.post('/', protect, authorize(['admin']), createPackage);
router.put('/:id', protect, authorize(['admin']), updatePackage);
router.delete('/:id', protect, authorize(['admin']), deletePackage);
router.get('/stats/overview', protect, authorize(['admin']), getPackageStats);

module.exports = router;