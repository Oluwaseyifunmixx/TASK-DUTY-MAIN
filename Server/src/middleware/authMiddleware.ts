import { Request, Response, NextFunction } from "express";
import Jwt  from "jsonwebtoken";
import User from "../models/User";

interface DecodedToken {
    id: string
}

export const protect =async (req:Request, res:Response, next:NextFunction): Promise<void> =>{
    try {
        const token = req.cookies.token

        if (!token) {
            res.status(401).json({
                success: false, 
                message: "Not authorized - no token provided"
            });
            return;
        }

        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken

        const user = await User.findById(decoded.id)
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Not authorized , user not found"
            });
            return;
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Token failed"
        })
    }
} 