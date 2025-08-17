"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingId = void 0;
const generateTrackingId = () => {
    const prefix = "TRK";
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${yyyy}${mm}${dd}-${randomNumber}`;
};
exports.generateTrackingId = generateTrackingId;
