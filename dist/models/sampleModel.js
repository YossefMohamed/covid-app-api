"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sampleSchema = new mongoose_1.default.Schema({
    link: {
        type: String,
        required: true,
    },
    covid: {
        type: Boolean,
    },
    breathProblem: {
        type: Boolean,
    },
    fever: {
        type: Boolean,
    }, tested: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
const Sample = mongoose_1.default.model("Sample", sampleSchema);
exports.default = Sample;
