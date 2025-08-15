import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role, IAuthProvider, IsActive } from "./user.interface";
import { User } from "./user.model";
import { userSearchableFields } from "./user.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

// Create User
const createUser = async (payload: Partial<IUser>, decodedToken?: JwtPayload) => {
    const { email, password, role = Role.RECEIVER, ...rest } = payload;

    // Only ADMIN can create ADMIN or SENDER
    if (decodedToken && decodedToken.role !== Role.ADMIN && (role === Role.ADMIN || role === Role.SENDER)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to create this user role");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };

    const user = await User.create({
        email,
        password: hashedPassword,
        role,
        auths: [authProvider],
        isActive: IsActive.ACTIVE,
        ...rest
    });

    return { data: user };
};

// Get all users with pagination, search, filter
const getAllUsers = async (query: Record<string, string>, decodedToken?: JwtPayload) => {
    if (decodedToken?.role !== Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admin can access all users");
    }

    const queryBuilder = new QueryBuilder(User.find(), query);

    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ]);

    return { data, meta };
};

// Get single user
const getSingleUser = async (id: string, decodedToken?: JwtPayload) => {
    const user = await User.findById(id).select("-password");

    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

    // Role-based access
    if (decodedToken?.role !== Role.ADMIN && decodedToken?.userId !== id) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this user");
    }

    return { data: user };
};

// Update User
const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken?: JwtPayload) => {
    const existingUser = await User.findById(userId);
    if (!existingUser) throw new AppError(httpStatus.NOT_FOUND, "User not found");

    // Role-based authorization
    if (decodedToken) {
        if ((decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) && userId !== decodedToken.userId) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this user");
        }

        if ((payload.role && decodedToken.role !== Role.ADMIN) || (payload.isActive && decodedToken.role !== Role.ADMIN)) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to change this field");
        }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return { data: updatedUser };
};

// Get my profile
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
    return { data: user };
};

// Export all as object
export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe
};
