"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectionSchema = new mongoose_1.default.Schema({
    from_city: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    to_city: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    departure_time: {
        type: Date,
        required: true
    },
    arrival_time: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    train_number: {
        type: String,
        required: true,
        trim: true
    },
    operator: {
        type: String,
        required: true,
        trim: true
    },
    train_type: {
        type: String,
        required: true,
        enum: ['high_speed', 'regional', 'night_train', 'international']
    },
    requires_reservation: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Create indexes for common queries
connectionSchema.index({ from_city: 1, to_city: 1, departure_time: 1 });
connectionSchema.index({ train_number: 1 });
connectionSchema.index({ operator: 1 });
// Validate that arrival_time is after departure_time
connectionSchema.pre('save', function (next) {
    if (this.arrival_time <= this.departure_time) {
        next(new Error('Arrival time must be after departure time'));
    }
    next();
});
const Connection = mongoose_1.default.model('Connection', connectionSchema);
exports.default = Connection;
//# sourceMappingURL=Connection.js.map