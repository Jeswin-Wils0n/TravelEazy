const express = require('express');
const { 
  updateUserProfile,
  getAllUsers,
  getUserWithBookings,
  uploadProfilePicture 
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.use(protect);

router.put('/profile', updateUserProfile);
router.post('/profile/picture', upload.single('profilePicture'), uploadProfilePicture);

router.get('/', authorize(['admin']), getAllUsers);
router.get('/:id', authorize(['admin']),getUserWithBookings);


module.exports = router;