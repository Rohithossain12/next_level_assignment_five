import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role, IAuthProvider, IsActive } from "./user.interface";
import { User } from "./user.model";
import { userSearchableFields } from "./user.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";


const createUser = async (payload: Partial<IUser>, decodedToken?: JwtPayload) => {
    const { email, password, role = Role.RECEIVER, ...rest } = payload;


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


const getAllUsers = async (query: Record<string, string>, decodedToken?: JwtPayload) => {
    if (![Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER].includes(decodedToken?.role as Role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admin or super admin can access all users");
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


const getSingleUser = async (id: string, decodedToken?: JwtPayload) => {
    const user = await User.findById(id).select("-password");

    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");


    if (decodedToken?.role !== Role.ADMIN && decodedToken?.userId !== id) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this user");
    }

    return { data: user };
};


const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken?: JwtPayload
) => {
    const existingUser = await User.findById(userId);
    if (!existingUser) throw new AppError(httpStatus.NOT_FOUND, "User not found");

    if (decodedToken) {

        if (
            (decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) &&
            userId !== decodedToken.userId
        ) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this user");
        }


        if (
            (payload.role && ![Role.ADMIN, Role.SUPER_ADMIN].includes(decodedToken.role)) ||
            (payload.isActive && ![Role.ADMIN, Role.SUPER_ADMIN].includes(decodedToken.role))
        ) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to change this field");
        }

        if (decodedToken.userId === userId && decodedToken.role === Role.SUPER_ADMIN && payload.role) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "SUPER_ADMIN cannot change their own role"
            );
        }


        if (
            decodedToken.userId === userId &&
            decodedToken.role === Role.ADMIN &&
            payload.role === Role.SUPER_ADMIN
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "ADMIN cannot change their role to SUPER_ADMIN"
            );
        }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return { data: updatedUser };
};



const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
    return { data: user };
};


export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe
};
