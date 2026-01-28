import mongoose, {Schema, model} from 'mongoose'

const notificationSchema = new Schema({
    // _id is automatically provided by Mongoose
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Optimized for "Get my notifications" queries
    },
    type: {
        type: String,
        enum: ['booking', 'payment', 'review', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Object, // For storing extra info like bookingId or deep links
        default: {}
    },
    read: {
        type: Boolean,
        default: false,
        index: true // Optimized for "Count unread" queries
    },
    channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false }
    }
}, {
    // Automatically manages 'createdAt' and 'updatedAt' fields
    timestamps: true
});

// Optimization: Compound index for filtering unread notifications for a specific user
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = model('Notification', notificationSchema);

export default Notification;