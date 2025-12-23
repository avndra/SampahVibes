import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Auth fields
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  
  // Profile fields
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  avatar: { 
    type: String, 
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  
  // Points & Stats (REAL DATA)
  totalPoints: { 
    type: Number, 
    default: 0,
    min: 0
  },
  totalWeight: { 
    type: Number, 
    default: 0,
    min: 0
  },
  totalDeposits: { 
    type: Number, 
    default: 0,
    min: 0
  },
  monthlyPoints: { 
    type: Map, 
    of: Number, 
    default: new Map()
  },
  
  // Cart
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      }
    }
  ],
  
  // Status
  isBanned: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);