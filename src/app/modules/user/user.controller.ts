
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload | undefined;
    const result = await UserServices.createUser(req.body, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: result.data
    });
});


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const decodedToken = req.user as JwtPayload | undefined;

    const result = await UserServices.updateUser(userId, payload, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User role updated successfully",
        data: result.data
    });
});


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const decodedToken = req.user as JwtPayload | undefined;

    const result = await UserServices.getAllUsers(query, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All users retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});


const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const decodedToken = req.user as JwtPayload | undefined;

    const result = await UserServices.getSingleUser(id, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User retrieved successfully",
        data: result.data
    });
});


const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile retrieved successfully",
        data: result.data
    });
});


const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    const payload = req.body;

    const result = await UserServices.updateMyProfile(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile updated successfully",
        data: result.data
    });
});

export const UserController = {
    createUser,
    updateUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateMyProfile

};
