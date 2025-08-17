"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const percel_interface_1 = require("./percel.interface");
exports.createParcelZodSchema = zod_1.default.object({
    type: zod_1.default.string({ error: "Type must be string" }),
    weight: zod_1.default.number({ error: "Weight must be number" }),
    fee: zod_1.default.number({ error: "Fee must be number" }),
    receiver: zod_1.default.string({ error: "Receiver id is required" }),
    pickupAddress: zod_1.default.string({ error: "Pickup address is required" }),
    deliveryAddress: zod_1.default.string({ error: "Delivery address is required" })
});
exports.updateParcelZodSchema = zod_1.default.object({
    type: zod_1.default.string().optional(),
    weight: zod_1.default.number().optional(),
    fee: zod_1.default.number().optional(),
    receiver: zod_1.default.string().optional(),
    pickupAddress: zod_1.default.string().optional(),
    deliveryAddress: zod_1.default.string().optional(),
    isBlocked: zod_1.default.boolean().optional(),
    status: zod_1.default.enum(Object.values(percel_interface_1.ParcelStatus)).optional()
});
