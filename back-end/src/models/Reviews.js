import mongoose, { Schema, model } from 'mongoose';


const reviewSchema = new Schema({
    // Mongoose automatically provides an _id (ObjectId)
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
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },

    // Primary rating with range validation (1 to 5)
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },

    // Breakdown of specific rating categories
    ratings: {
        cleanliness: { type: Number, min: 1, max: 5 },
        accuracy: { type: Number, min: 1, max: 5 },
        location: { type: Number, min: 1, max: 5 },
        valueForMoney: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 }
    },

    comment: {
        type: String,
        required: true,
        trim: true
    },

    images: [{
        url: String,
        publicId: String
    }],

    // Array of Users who found this review helpful
    helpful: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Admin response section
    response: {
        comment: { type: String, trim: true },
        respondedAt: { type: Date },
        respondedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'flagged'],
        default: 'pending'
    }

}, {
    // Automatically manages 'createdAt' and 'updatedAt' fields
    timestamps: true
});

// Optimization: Index for faster lookups by farmhouse or user
reviewSchema.index({ farmhouseId: 1, status: 1 });
reviewSchema.index({ userId: 1 });

const Review = model('Review', reviewSchema);

export default Review;