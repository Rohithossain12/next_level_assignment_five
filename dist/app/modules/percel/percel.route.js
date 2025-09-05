"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const check_auth_1 = require("../../middlewares/check.auth");
const user_interface_1 = require("../user/user.interface");
const percel_controller_1 = require("./percel.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const percel_validation_1 = require("./percel.validation");
const router = express_1.default.Router();
router.post("/", (0, check_auth_1.checkAuth)(user_interface_1.Role.SENDER), (0, validateRequest_1.validateRequest)(percel_validation_1.createParcelZodSchema), percel_controller_1.ParcelController.createParcel);
router.patch("/cancel/:id", (0, check_auth_1.checkAuth)(user_interface_1.Role.SENDER), percel_controller_1.ParcelController.cancelParcel);
router.get("/me", (0, check_auth_1.checkAuth)(user_interface_1.Role.SENDER), percel_controller_1.ParcelController.getMyParcels);
// Receiver routes
router.get("/incoming", (0, check_auth_1.checkAuth)(user_interface_1.Role.RECEIVER), percel_controller_1.ParcelController.getIncomingParcels);
router.patch("/confirm/:id", (0, check_auth_1.checkAuth)(user_interface_1.Role.RECEIVER), percel_controller_1.ParcelController.confirmDelivery);
// Admin routes
router.get("/", (0, check_auth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), percel_controller_1.ParcelController.getAllParcels);
router.patch("/status/:id", (0, check_auth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(percel_validation_1.updateParcelZodSchema), percel_controller_1.ParcelController.updateStatus);
router.patch("/block/:id", (0, check_auth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), percel_controller_1.ParcelController.blockParcel);
exports.ParcelRoutes = router;
