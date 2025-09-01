import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive, Role } from "../modules/user/user.interface";


interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const checkAuth = (...authRoles: Role[]) => async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken || req.headers.authorization;

    if (!accessToken) {
      throw new AppError(403, "No token received");
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    const user = await User.findOne({ email: verifiedToken.email });
    if (!user) throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");

    if (!user.isVerified) throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");

    if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, `User is ${user.isActive}`);
    }

    if (user.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");

    if (authRoles.length && !authRoles.includes(verifiedToken.role as Role)) {
      throw new AppError(403, "You are not permitted to view this route");
    }

  
    req.user = verifiedToken;

    next();
  } catch (error) {
    next(error);
  }
};
