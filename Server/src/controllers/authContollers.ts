
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateRandomToken, hashToken, generateAccessToken } from "../utils/generateToken";
import mongoose from "mongoose";

// Generate Token
const generateToken = (id: string): string =>{
    return jwt.sign({id}, process.env.JWT_SECRET as string, {
        expiresIn: "7d"
    })
}

// Send A Token as Cookie
const sendTokenCookie = (res:Response, token: string)=> {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7* 24* 60 * 60* 1000
    });
}

// Register A user
export const RegisterUser = async ( req:Request, res:Response): Promise<void> =>{
    try {
        const {name, email, password} = req.body;

        if (!name || !email ||!password) {
            res.status(400).json({
                success: false,
                message: "Please fill out all infomations"
            });
            return;
        }

        const ExistingUser = await User.findOne({email})

        if (ExistingUser) {
            res.status(400).json({
                success: false,
                message: "Email is already registered"
            });
            return;
        }

        const newUser = await User.create({name,
             email: email.toLowerCase(),
             password
            })

        const token = generateToken((newUser._id as mongoose.Types.ObjectId).toString())
        sendTokenCookie(res, token)

        res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error
        })
    }
}

// Login User

export const LoginUser = async(req:Request, res:Response): Promise<void> =>{
    try {
        const {name, email, password} = req.body

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please Provide your email and password"
            });
            return;
        }

        const user = await User.findOne({email}).select("+password")  // since i set selected false on the schema, i have to explicitly ask for it during login
        if (!user) {
            res.status(401).json({
                success: false, 
                message: "Invalid credentials"
            });
            return;
        }

        const isMatch = await user.comparePassword(password)
        if(!isMatch){
           res.status(401).json({
            success: false,
            message: "Invalid credentials"
           });
           return;
        }

        const token = generateToken((user._id as mongoose.Types.ObjectId).toString())
        sendTokenCookie(res, token)

        
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
       res.status(500).json({
        success: false,
        message: "Server error",
        error
       }) 
    }
}

// Logout User
export const LogoutUser = async(req: Request, res:Response): Promise<void> =>{
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}

// Get current loggedin User

export const getMe =  async(req: Request, res:Response): Promise<void> =>{
    try {
        const user = await User.findById(req.user?._id)

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error
        })
    }
}

// Update Profile

export const updateProfile = async (req:Request, res: Response): Promise<void> =>{
    try {
        const {name, currentPassword, newPassword} = req.body

        const user = await User.findById(req.user?._id).select("+password")
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        // Update name
        if (name) {
            user.name = name
        }

        // Update password

        if (newPassword) {
            if (!currentPassword) {
                res.status(400).json({
                    success: false,
                    message: "Current password is required"
                });
                return;
            }
            const isMatch = await user.comparePassword(currentPassword)
            if (!isMatch) {
                res.status(401).json({
                    success: false,
                    message: "Current password is incorrect"
                });
                return;
            }
            user.password = newPassword
        }

        await user.save()

        res.status(200).json({
            success: true,
            message: "Profile successfully updated",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error
        })
    }
}
// // Forgot Password
// export const ForgotPassword = async(res:Response, req: Request): Promise<void> =>{
//     try {
//         const {email} = req.body;
//         if (!email) {
//             res.status(400).json({
//                 success: false,
//                 message: "Email is required"
//             });
//             return;
//         }

//         const user = await User.findOne({email: email.toLowerCase()});
//         if (!User) {
//             // Always return success even if user not found — security reason
//            res.status(200).json({
//             success: true,
//             message:"If that email is registered, you will receive a reset link shortly"
//            });
//            return;
//         }
//         // Generate reset token 
//          const rawToken = generateRandomToken();
//          const hashedToken = hashToken(rawToken);

//          user.resetPasswordToken = hashedToken;
//          user.resetPasswordExpire = new Date(
//             Date.now() + Number(process.env.RESET_TOKEN_EXPIRE || 3600000)
//          );

//          await user?.save();
//     } catch (error) {
        
//     }
// }
