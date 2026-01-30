import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['order_update', 'system', 'promo'],
        default: 'system'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    link: {
        type: String // Optional URL to redirect
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

NotificationSchema.index({ userId: 1, read: 1 });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
