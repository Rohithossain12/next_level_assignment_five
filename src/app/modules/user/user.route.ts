import express from "express";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/check.auth";

const router = express.Router();

router.post("/register", validateRequest(createUserZodSchema), UserController.createUser);
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUsers);
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getSingleUser);
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser);

export const UserRoutes = router
