import Jwt from "jsonwebtoken";
import crypto from "crypto";


export const generateRandomToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

// HASH TOKEN — before storing in database

export const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex")
};

export const generateAccessToken = (id: string, role: string) =>{
    const secret = process.env.JWT_SECRET!;
    return Jwt.sign({id, role}, secret, { expiresIn: "15m"})
};