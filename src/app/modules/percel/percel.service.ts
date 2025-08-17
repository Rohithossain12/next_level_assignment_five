import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ParcelStatus } from "./percel.interface";
import { Parcel } from "./percel.model";


const createParcel = async (user: any, payload: any) => {
    const parcel = await Parcel.create({
        ...payload,
        sender: user.userId,
        statusLogs: [{ status: ParcelStatus.REQUESTED, updatedBy: user.userId }]
    });
    return { data: parcel };
};

const cancelParcel = async (user: any, parcelId: string) => {
    const parcel = await Parcel.findOne({ _id: parcelId, sender: user.userId });
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    const lastStatus = parcel.statusLogs[parcel.statusLogs.length - 1].status;
    if (lastStatus !== ParcelStatus.REQUESTED) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot cancel a dispatched parcel");
    }
    parcel.statusLogs.push({ status: ParcelStatus.CANCELED, updatedBy: user.userId,timestamp: new Date() });
    await parcel.save();
    return { data: parcel };
};

const getMyParcels = async (user: any) => {
    const parcels = await Parcel.find({ sender: user.userId });
    return { data: parcels };
};

const getIncomingParcels = async (user: any) => {
    const parcels = await Parcel.find({ receiver: user.userId });
    return { data: parcels };
};

const confirmDelivery = async (user: any, parcelId: string) => {
    const parcel = await Parcel.findOne({ _id: parcelId, receiver: user.userId });
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    parcel.statusLogs.push({ status: ParcelStatus.DELIVERED, updatedBy: user.userId, timestamp: new Date() });
    await parcel.save();
    return { data: parcel };
};

const getAllParcels = async (query: any) => {
    const parcels = await Parcel.find();
    return { data: parcels };
};

const updateStatus = async (user: any, parcelId: string, status: ParcelStatus) => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    parcel.statusLogs.push({ status, updatedBy: user.userId,timestamp: new Date() });
    await parcel.save();
    return { data: parcel };
};

const blockParcel = async (parcelId: string) => {
    const parcel = await Parcel.findByIdAndUpdate(parcelId, { isBlocked: true }, { new: true });
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    return { data: parcel };
};

export const ParcelService = {
    createParcel,
    cancelParcel,
    getMyParcels,
    getIncomingParcels,
    confirmDelivery,
    getAllParcels,
    updateStatus,
    blockParcel
};
