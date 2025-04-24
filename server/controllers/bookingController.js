const Booking = require('../models/Booking');
const Package = require('../models/Package');

exports.getAllBookings = async (req, res) => {
  try {
    let query;
    
    if (req.user.role === 'admin') {
      query = Booking.find();
    } else {
      query = Booking.find({ user: req.user.id });
    }
    
    query = query.populate({
      path: 'package',
      select: 'fromLocation toLocation startDate endDate basePrice'
    });
    
    if (req.user.role === 'admin') {
      query = query.populate({
        path: 'user',
        select: 'name email'
      });
    }
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    const bookings = await query;
    
    const total = await Booking.countDocuments(
      req.user.role === 'admin' ? {} : { user: req.user.id }
    );
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const today = new Date();
    
    let query = { user: req.user.id };
    
    let bookings = await Booking.find(query)
      .populate({
        path: 'package',
        select: 'fromLocation toLocation startDate endDate basePrice'
      });
    
    if (status) {
      bookings = bookings.filter(booking => {
        const packageStartDate = new Date(booking.package.startDate);
        const packageEndDate = new Date(booking.package.endDate);
        
        if (status === 'completed') {
          return packageEndDate < today;
        } else if (status === 'active') {
          return packageStartDate <= today && today <= packageEndDate;
        } else if (status === 'upcoming') {
          return packageStartDate > today;
        }
        
        return true;
      });
    }
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'package',
        select: 'fromLocation toLocation startDate endDate basePrice includedServices foodPrice accommodationPrice'
      });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    req.body.user = req.user.id;
    
    const packageItem = await Package.findById(req.body.package);
    
    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    let totalPrice = packageItem.basePrice;
    
    if (req.body.selectedOptions.food && packageItem.foodPrice) {
      totalPrice += packageItem.foodPrice;
    }
    
    if (req.body.selectedOptions.accommodation && packageItem.accommodationPrice) {
      totalPrice += packageItem.accommodationPrice;
    }
    
    req.body.totalPrice = totalPrice;
    
    const booking = await Booking.create(req.body);
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBookingStatsByPackage = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$package',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: '_id',
          as: 'packageDetails'
        }
      },
      {
        $unwind: '$packageDetails'
      },
      {
        $project: {
          _id: 1,
          count: 1,
          totalRevenue: 1,
          packageName: '$packageDetails.fromLocation',
          toLocation: '$packageDetails.toLocation',
          startDate: '$packageDetails.startDate',
          endDate: '$packageDetails.endDate'
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};