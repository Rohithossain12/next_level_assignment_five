import { model, Schema } from "mongoose";
import { IParcel, IParcelStatusLog, ParcelStatus } from "./percel.interface";
import { generateTrackingId } from "../../utils/generateTrackingId";



const ParcelStatusLogSchema = new Schema<IParcelStatusLog>(
    {
        status: {
            type: String,
            enum: Object.values(ParcelStatus),
            required: true
        },
        location: { type: String },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
    },
    { _id: false }
);


const ParcelSchema = new Schema<IParcel>(
    {
        trackingId: {
            type: String,
            required: true,
            unique: true,
            default: generateTrackingId
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
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
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
    },
    { timestamps: true, versionKey: false }
);

export const Parcel = model<IParcel>("Parcel", ParcelSchema);
