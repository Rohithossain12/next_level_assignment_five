import express from "express";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";
import { ParcelController } from "./percel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZodSchema, updateParcelZodSchema } from "./percel.validation";


const router = express.Router();

router.post(
  "/",
  checkAuth(Role.SENDER),
  validateRequest(createParcelZodSchema),
  ParcelController.createParcel
);

router.patch(
  "/cancel/:id",
  checkAuth(Role.SENDER),
  ParcelController.cancelParcel
);

router.get(
  "/me",
  checkAuth(Role.SENDER),
  ParcelController.getMyParcels
);

// Receiver routes
router.get(
  "/incoming",
  checkAuth(Role.RECEIVER),
  ParcelController.getIncomingParcels
);

router.patch(
  "/confirm/:id",
  checkAuth(Role.RECEIVER),
  ParcelController.confirmDelivery
);

// Admin routes
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.getAllParcels
);

router.patch(
  "/status/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateParcelZodSchema),
  ParcelController.updateStatus
);

router.patch(
  "/block/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.blockParcel
);

export const ParcelRoutes = router;
