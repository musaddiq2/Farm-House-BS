import mongoose, { Schema, model } from 'mongoose';


const bookingSchema = new Schema({
    // _id is automatically handled by Mongoose
    bookingId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmhouseId: {
        type: Schema.Types.ObjectId,
        ref: 'Farmhouse',
        required: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the admin/owner of the farmhouse
        required: true
    },

    guestDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
        phone: { type: String, required: true },
        guestCount: { type: Number, required: true },
        emergencyContact: String
    },

    bookingDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in hours
        required: true
    },

    pricing: {
        basePrice: { type: Number, default: 0 },
        foodCharges: { type: Number, default: 0 },
        additionalServices: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true }
    },

    addons: [{
        name: String,
        price: Number
    }],

    specialRequests: String,

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
        default: 'pending'
    },

    payment: {
        status: {
            type: String,
            enum: ['pending', 'partial', 'completed', 'refunded'],
            default: 'pending'
        },
        method: String,
        transactionId: String,
        paidAmount: { type: Number, default: 0 },
        paymentDate: Date
    },

    cancellation: {
        cancelledBy: { type: String }, // e.g., 'user' or 'admin'
        reason: String,
        cancelledAt: Date,
        refundAmount: { type: Number, default: 0 }
    },

    notifications: {
        requestSent: { type: Boolean, default: false },
        accepted: { type: Boolean, default: false },
        paymentReceived: { type: Boolean, default: false },
        reminders: [Date]
    }

}, {
    timestamps: true // This creates createdAt and updatedAt automatically
});

// Optimization: Create an index for common queries
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ farmhouseId: 1, bookingDate: 1 });

const Booking = model('Booking', bookingSchema);

export default Booking;