import { Request, Response, NextFunction } from "express";
import { EUserRole } from "../config/types";

export const authorization = (fn: any, requiredRole: EUserRole) => 
(req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}