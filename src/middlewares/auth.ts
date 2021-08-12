import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ETokenType, EUserRole } from "../config/types";
import { authService } from "../services";
import tokenService from "../services/token.service";
import { ApiError } from "../utils";

export const auth = (...requiredRole: EUserRole[]) => 
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) {
            throw new Error("⛔ Please authenticate");
        }
        const token = req.headers.authorization.split(' ')[1];
        const accessTokenDoc = await tokenService.verifyToken(token, ETokenType.ACCESS);
        const user = await authService.getUserById(accessTokenDoc.user);
        if (!user || !requiredRole.includes(user.role)) {
            throw new Error("⛔ Access Unauthorized");
        }
        next()
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, error);
    }
}