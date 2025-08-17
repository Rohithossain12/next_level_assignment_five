import z from "zod";
import { ParcelStatus } from "./percel.interface";


export const createParcelZodSchema = z.object({
  type: z.string({ error: "Type must be string" }),
  weight: z.number({ error: "Weight must be number" }),
  fee: z.number({ error: "Fee must be number" }),
  receiver: z.string({ error: "Receiver id is required" }),
  pickupAddress: z.string({ error: "Pickup address is required" }),
  deliveryAddress: z.string({ error: "Delivery address is required" })
});

export const updateParcelZodSchema = z.object({
  type: z.string().optional(),
  weight: z.number().optional(),
  fee: z.number().optional(),
  receiver: z.string().optional(),
  pickupAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  isBlocked: z.boolean().optional(),
  status: z.enum(Object.values(ParcelStatus) as [string]).optional()
});
