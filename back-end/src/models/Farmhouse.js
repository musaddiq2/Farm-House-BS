import mongoose, { Schema, model } from 'mongoose';

const farmhouseSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    description: String,

    location: {
        address: String,
        city: { type: String, index: true },
        state: String,
        pincode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },

    images: [{
        url: String,
        publicId: String,
        category: String,
        order: Number
    }],

    videos: [{
        url: String,
        publicId: String
    }],

    amenities: [{
        name: String,
        icon: String,
        available: { type: Boolean, default: true }
    }],

    capacity: {
        minGuests: Number,
        maxGuests: Number
    },

    pricing: {
        hourly: {
            '4hr': Number,
            '6hr': Number,
            '8hr': Number,
            '12hr': Number
        },
        fullDay: Number,
        multiDay: Number,
        weekendMultiplier: { type: Number, default: 1 },
        seasonalRates: [{
            season: String,
            startDate: Date,
            endDate: Date,
            multiplier: Number
        }]
    },

    foodOptions: [{
        meal: String,
        available: Boolean,
        price: Number,
        menu: String
    }],

    rules: {
        checkInTime: String,
        checkOutTime: String,
        cancellationPolicy: String,
        securityDeposit: Number,
        petsAllowed: { type: Boolean, default: false },
        alcoholAllowed: { type: Boolean, default: false },
        smokingAllowed: { type: Boolean, default: false },
        customRules: [String]
    },

    availability: [{
        date: Date,
        available: { type: Boolean, default: true },
        reason: String
    }],

    instantBooking: { type: Boolean, default: false },
    minBookingDuration: Number,
    maxBookingDuration: Number,
    advanceBookingDays: Number,

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'inactive'],
        default: 'pending'
    },
    featured: { type: Boolean, default: false },

    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },

    totalBookings: { type: Number, default: 0 },
    views: { type: Number, default: 0 }

}, {
    timestamps: true
});

// Create the model
const Farmhouse = model('Farmhouse', farmhouseSchema);

export default Farmhouse;