import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    // Snapshot data in case product changes later
    productName: {
        type: String,
        required: true
    },
    productImage: {
        type: String
    },
    pointsCost: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalPoints: {
        type: Number,
        required: true
    },

    // Fulfillment
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
        default: 'pending'
    },
    shippingData: {
        address: String,
        city: String,
        postalCode: String,
        note: String
    },

    // Tracking
    trackingNumber: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying by user and date
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
