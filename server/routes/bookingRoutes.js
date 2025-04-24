const express = require('express');
const { 
  getAllBookings, 
  getUserBookings,
  getBooking, 
  createBooking, 
  updateBookingStatus,
  getBookingStatsByPackage
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/admin', authorize(['admin']), getAllBookings);
router.get('/stats/by-package', authorize(['admin']), getBookingStatsByPackage);
router.patch('/:id/status', authorize(['admin']), updateBookingStatus);

router.get('/user', getUserBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);

module.exports = router;