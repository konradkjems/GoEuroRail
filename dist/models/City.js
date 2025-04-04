"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const citySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    station_codes: [{
            type: String,
            trim: true
        }],
    timezone: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true,
        trim: true
    },
    popular_routes_from: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'City'
        }],
    image_url: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
// Create indexes for common queries
citySchema.index({ name: 1, country: 1 }, { unique: true });
citySchema.index({ region: 1 });
citySchema.index({ latitude: 1, longitude: 1 });
const City = mongoose_1.default.model('City', citySchema);
exports.default = City;
//# sourceMappingURL=City.js.map