import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: { 
    type: String, 
    enum: ['voucher', 'electronics', 'lifestyle', 'donation'],
    required: true 
  },
  pointsCost: { 
    type: Number, 
    required: true,
    min: 0
  },
  stock: { 
    type: Number, 
    default: 0,
    min: 0
  },
  image: { 
    type: String, 
    default: 'https://placehold.co/400x300/22c55e/white?text=Product'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Indexes
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ featured: 1, isActive: 1 });
ProductSchema.index({ pointsCost: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);