import { Types } from "mongoose";

export enum ParcelStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  DISPATCHED = "DISPATCHED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  RETURNED = "RETURNED",
}

export interface IParcelStatusLog {
  status: ParcelStatus;          
  location?: string;             
  updatedBy: Types.ObjectId;     
  timestamp: Date;                
}

export interface IParcel {
  _id?: Types.ObjectId;
  trackingId: string;            
  type: string;                  
  weight: number;                
  fee: number;                    
  sender: Types.ObjectId;         
  receiver: Types.ObjectId;       
  pickupAddress: string;          
  deliveryAddress: string;       
  statusLogs: IParcelStatusLog[]; 
  isBlocked?: boolean;            
  createdAt?: Date;
  updatedAt?: Date;
}
