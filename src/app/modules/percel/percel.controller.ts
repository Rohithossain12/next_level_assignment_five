import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelService } from "./percel.service";
import { JwtPayload } from "jsonwebtoken";


const createParcel = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelService.createParcel(req.user, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel created successfully",
        data: result.data
    });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelService.cancelParcel(req.user, req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel canceled successfully",
        data: result.data
    });
});

const getMyParcels = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelService.getMyParcels(req.user);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your parcels retrieved successfully",
        data: result.data
    });
});

const getIncomingParcels = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelService.getIncomingParcels(req.user);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Incoming parcels retrieved successfully",
        data: result.data
    });
});

const confirmDelivery = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelService.confirmDelivery(req.user, req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel delivery confirmed",
        data: result.data
    });
});

const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const decodedToken = req.user as JwtPayload | undefined;

    const result = await ParcelService.getAllParcels(query, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All parcels retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelService.updateStatus(req.user, req.params.id, req.body.status);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Status updated successfully",
        data: result.data
    });
});

const blockParcel = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelService.blockParcel(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel blocked successfully",
        data: result.data
    });
});

export const ParcelController = {
    createParcel,
    cancelParcel,
    getMyParcels,
    getIncomingParcels,
    confirmDelivery,
    getAllParcels,
    updateStatus,
    blockParcel
};
