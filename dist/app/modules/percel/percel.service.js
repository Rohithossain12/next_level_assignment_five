"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const percel_interface_1 = require("./percel.interface");
const percel_model_1 = require("./percel.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_interface_1 = require("../user/user.interface");
const percel_constant_1 = require("./percel.constant");
const userFields = "name email phone";
const createParcel = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield percel_model_1.Parcel.create(Object.assign(Object.assign({}, payload), { sender: user.userId, statusLogs: [
            { status: percel_interface_1.ParcelStatus.REQUESTED, updatedBy: user.userId }
        ] }));
    const populatedParcel = yield percel_model_1.Parcel.findById(parcel._id)
        .populate("sender", userFields)
        .populate("receiver", userFields);
    return { data: populatedParcel };
});
const cancelParcel = (user, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield percel_model_1.Parcel.findOne({ _id: parcelId, sender: user.userId })
        .populate("sender", userFields)
        .populate("receiver", userFields);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    const lastStatus = parcel.statusLogs[parcel.statusLogs.length - 1].status;
    if (lastStatus !== percel_interface_1.ParcelStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cannot cancel a dispatched parcel");
    }
    parcel.statusLogs.push({
        status: percel_interface_1.ParcelStatus.CANCELED,
        updatedBy: user.userId,
        timestamp: new Date(),
    });
    yield parcel.save();
    return { data: parcel };
});
const getMyParcels = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield percel_model_1.Parcel.find({ sender: user.userId })
        .populate("sender", userFields)
        .populate("receiver", userFields);
    return { data: parcels };
});
const getIncomingParcels = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield percel_model_1.Parcel.find({ receiver: user.userId })
        .populate("sender", userFields)
        .populate("receiver", userFields);
    return { data: parcels };
});
const confirmDelivery = (user, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield percel_model_1.Parcel.findOne({ _id: parcelId, receiver: user.userId })
        .populate("sender", userFields)
        .populate("receiver", userFields);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    parcel.statusLogs.push({
        status: percel_interface_1.ParcelStatus.DELIVERED,
        updatedBy: user.userId,
        timestamp: new Date(),
    });
    yield parcel.save();
    return { data: parcel };
});
const getAllParcels = (query, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role)) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admin or super admin can access all parcels");
    }
    const baseQuery = percel_model_1.Parcel.find()
        .populate("sender", userFields)
        .populate("receiver", userFields);
    const queryBuilder = new QueryBuilder_1.QueryBuilder(baseQuery, query);
    const parcelsData = queryBuilder
        .filter()
        .search(percel_constant_1.parcelSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        parcelsData.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const updateStatus = (user, parcelId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield percel_model_1.Parcel.findById(parcelId)
        .populate("sender", userFields)
        .populate("receiver", userFields);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    parcel.statusLogs.push({
        status,
        updatedBy: user.userId,
        timestamp: new Date(),
    });
    yield parcel.save();
    return { data: parcel };
});
const blockParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield percel_model_1.Parcel.findByIdAndUpdate(parcelId, { isBlocked: true }, { new: true })
        .populate("sender", userFields)
        .populate("receiver", userFields);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    return { data: parcel };
});
exports.ParcelService = {
    createParcel,
    cancelParcel,
    getMyParcels,
    getIncomingParcels,
    confirmDelivery,
    getAllParcels,
    updateStatus,
    blockParcel,
};
