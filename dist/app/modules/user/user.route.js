"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const check_auth_1 = require("../../middlewares/check.auth");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserController.createUser);
router.get("/all-users", (0, check_auth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserController.getAllUsers);
router.get("/me", (0, check_auth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.getMe);
router.get("/:id", (0, check_auth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserController.getSingleUser);
router.patch("/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), (0, check_auth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.updateUser);
exports.UserRoutes = router;
