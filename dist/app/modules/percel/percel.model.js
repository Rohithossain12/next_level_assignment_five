"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const percel_interface_1 = require("./percel.interface");
const generateTrackingId_1 = require("../../utils/generateTrackingId");
const ParcelStatusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(percel_interface_1.ParcelStatus),
        required: true
    },
    location: { type: String },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
}, { _id: false });
const ParcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true,
        default: generateTrackingId_1.generateTrackingId
    },
    type: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    statusLogs: {
        type: [ParcelStatusLogSchema],
        default: []
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
}, { timestamps: true, versionKey: false });
exports.Parcel = (0, mongoose_1.model)("Parcel", ParcelSchema);
