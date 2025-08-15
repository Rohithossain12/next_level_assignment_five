import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone?: string;
    picture?: string;
    address?: string;
    role: Role;
    auths: IAuthProvider[];
    isActive?: IsActive;
    isVerified?: boolean;
    isDeleted?: boolean;
    parcels?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}