import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userName: {
    type: String // Snapshot of user name
  },
  userEmail: {
    type: String // Snapshot of user email
  },
  type: {
    type: String,
    enum: ['earn', 'redeem', 'scan'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String
  },
  // Order specific fields
  status: {
    type: String,
    enum: ['pending', 'approved', 'shipped', 'completed', 'rejected'],
    default: function () {
      return this.type === 'redeem' ? 'pending' : undefined; // Only redeems have status
    }
  },
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    note: String,
    coordinates: { // For map visualization if implemented later
      lat: Number,
      lng: Number
    }
  },
  adminNote: {
    type: String // Message from admin regarding the order
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
ActivitySchema.index({ userId: 1, timestamp: -1 });
ActivitySchema.index({ type: 1 });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);