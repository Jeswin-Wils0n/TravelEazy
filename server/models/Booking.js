const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  selectedOptions: {
    food: {
      type: Boolean,
      default: false
    },
    accommodation: {
      type: Boolean,
      default: false
    }
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'cancelled', 'completed'],
    default: 'accepted'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.virtual('currentStatus').get(function() {
  const today = new Date();
  
  if (!this._package) {
    return this.status;
  }
  
  if (this._package.endDate < today) {
    return 'completed';
  } else if (this._package.startDate <= today && today <= this._package.endDate) {
    return 'active';
  } else {
    return 'upcoming';
  }
});

bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);