"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cityVisitSchema = new mongoose_1.default.Schema({
    city: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    arrival: {
        type: Date,
        required: true
    },
    departure: {
        type: Date,
        required: true
    }
}, { _id: false });
const tripSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trip_name: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    cities: [cityVisitSchema],
    transport_modes: [{
            type: String,
            enum: ['train', 'bus', 'ferry'],
            required: true
        }],
    total_distance: {
        type: Number,
        required: true,
        min: 0
    },
    total_duration: {
        type: Number,
        required: true,
        min: 0
    },
    budget_estimate: {
        type: Number,
        required: true,
        min: 0
    },
    travel_notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
// Validate that end_date is after start_date
tripSchema.pre('save', function (next) {
    if (this.end_date <= this.start_date) {
        next(new Error('End date must be after start date'));
    }
    next();
});
// Validate that city visit dates are within trip dates
tripSchema.pre('save', function (next) {
    const validDates = this.cities.every(visit => {
        return visit.arrival >= this.start_date &&
            visit.departure <= this.end_date &&
            visit.departure > visit.arrival;
    });
    if (!validDates) {
        next(new Error('City visit dates must be within trip dates and departure must be after arrival'));
    }
    next();
});
const Trip = mongoose_1.default.model('Trip', tripSchema);
exports.default = Trip;
//# sourceMappingURL=Trip.js.map