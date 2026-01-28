import mongoose, { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
    // Mongoose automatically provides an _id (ObjectId)
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        required: true,
        uppercase: true,
        default: 'INR'
    },
    paymentMethod: {
        type: String, // e.g., 'Card', 'UPI', 'NetBanking'
        required: true
    },
    paymentGateway: {
        type: String, // e.g., 'Razorpay', 'Stripe', 'PayPal'
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true, // Prevents duplicate transaction entries
        index: true
    },
    status: {
        type: String,
        enum: ['initiated', 'success', 'failed', 'refunded'],
        default: 'initiated',
        index: true
    },
    metadata: {
        type: Object, // Stores flexible response data from the payment gateway
        default: {}
    }
}, {
    // Automatically manages 'createdAt' and 'updatedAt' fields
    timestamps: true
});

// Optimization: Index for common dashboard/reporting queries
paymentSchema.index({ createdAt: -1 });

const Payment = model('Payment', paymentSchema);

export default Payment;