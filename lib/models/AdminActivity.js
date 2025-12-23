import mongoose from 'mongoose';

const AdminActivitySchema = new mongoose.Schema({
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  action: { 
    type: String, 
    enum: ['create', 'update', 'delete'], 
    required: true 
  },
  entityType: { 
    type: String,
    enum: ['product', 'user'], 
    required: true 
  },
  entityId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  entityName: { 
    type: String,
    required: true 
  },
  details: { 
    type: mongoose.Schema.Types.Mixed,
    default: {}
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
AdminActivitySchema.index({ adminId: 1, timestamp: -1 });
AdminActivitySchema.index({ action: 1 });
AdminActivitySchema.index({ entityType: 1 });
AdminActivitySchema.index({ timestamp: -1 });

export default mongoose.models.AdminActivity || mongoose.model('AdminActivity', AdminActivitySchema);