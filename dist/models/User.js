"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    home_city: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    saved_routes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Trip'
        }],
    travel_preferences: {
        prefer_night_trains: {
            type: Boolean,
            default: false
        },
        scenic_routes: {
            type: Boolean,
            default: false
        },
        low_budget: {
            type: Boolean,
            default: false
        }
    },
    interrail_pass_type: {
        type: String,
        enum: ['continuous', 'flexi', 'none'],
        default: 'none'
    },
    language: {
        type: String,
        enum: ['en', 'de', 'fr', 'es', 'it'],
        default: 'en'
    },
    notifications_enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs_1.default.hash(this.password, 10);
    }
    next();
});
// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map