const User = require('../models/User');
const Booking = require('../models/Booking');

exports.updateUserProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'address', 'profilePicture'];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user.id;
    
    const imageUrl = req.file.path;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: {
        profilePicture: imageUrl,
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let query = User.find().select('-password');
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    const users = await query;
    
    const total = await User.countDocuments();
    
    const userIds = users.map(user => user._id);
    const bookingCounts = await Booking.aggregate([
      {
        $match: {
          user: { $in: userIds }
        }
      },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const usersWithBookingCount = users.map(user => {
      const userBookings = bookingCounts.find(item => item._id.toString() === user._id.toString());
      return {
        ...user.toObject(),
        bookingCount: userBookings ? userBookings.count : 0
      };
    });
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: usersWithBookingCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserWithBookings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const bookings = await Booking.find({ user: req.params.id })
      .populate({
        path: 'package',
        select: 'fromLocation toLocation startDate endDate basePrice'
      });
    
    res.status(200).json({
      success: true,
      data: {
        user,
        bookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};