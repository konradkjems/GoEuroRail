"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const attractionSchema = new mongoose_1.default.Schema({
    city_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['museum', 'landmark', 'park', 'restaurant', 'shopping', 'entertainment'],
        trim: true
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    opening_hours: {
        type: String,
        required: true
    },
    entry_fee: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    photo_url: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
// Create indexes for common queries
attractionSchema.index({ city_id: 1 });
attractionSchema.index({ category: 1 });
attractionSchema.index({ coordinates: '2dsphere' });
const Attraction = mongoose_1.default.model('Attraction', attractionSchema);
exports.default = Attraction;
//# sourceMappingURL=Attraction.js.map