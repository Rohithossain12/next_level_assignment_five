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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const user_constant_1 = require("./user.constant");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const createUser = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role = user_interface_1.Role.RECEIVER } = payload, rest = __rest(payload, ["email", "password", "role"]);
    if (decodedToken && decodedToken.role !== user_interface_1.Role.ADMIN && (role === user_interface_1.Role.ADMIN || role === user_interface_1.Role.SENDER)) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to create this user role");
    }
    const existingUser = yield user_model_1.User.findOne({ email });
    if (existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = { provider: "credentials", providerId: email };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, role, auths: [authProvider], isActive: user_interface_1.IsActive.ACTIVE }, rest));
    return { data: user };
});
const getAllUsers = (query, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role)) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admin or super admin can access all users");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(user_constant_1.userSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ]);
    return { data, meta };
});
const getSingleUser = (id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role) !== user_interface_1.Role.ADMIN && (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId) !== id) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to view this user");
    }
    return { data: user };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (decodedToken) {
        if ((decodedToken.role === user_interface_1.Role.RECEIVER || decodedToken.role === user_interface_1.Role.SENDER) &&
            userId !== decodedToken.userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update this user");
        }
        if ((payload.role && ![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(decodedToken.role)) ||
            (payload.isActive && ![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(decodedToken.role))) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to change this field");
        }
        if (decodedToken.userId === userId && decodedToken.role === user_interface_1.Role.SUPER_ADMIN && payload.role) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "SUPER_ADMIN cannot change their own role");
        }
        if (decodedToken.userId === userId &&
            decodedToken.role === user_interface_1.Role.ADMIN &&
            payload.role === user_interface_1.Role.SUPER_ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "ADMIN cannot change their role to SUPER_ADMIN");
        }
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return { data: updatedUser };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    return { data: user };
});
const updateMyProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (payload.role || payload.isActive) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to change this field");
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    }).select("-password");
    return { data: updatedUser };
});
exports.UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    updateMyProfile
};
