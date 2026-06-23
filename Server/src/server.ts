import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import  cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from './config/db';
import taskRoutes from "./routes/TaskRoutes";
import authRoutes from "./routes/authRoutes"

dotenv.config();

const app = express()

// Middleware
app.use(cors({
    origin: "http://localhost:5173",   
    // this is critical for cookies to work accross all. Without credentials: true here, the browser will refuse to send/receive the cookie
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())   // This just let express read req.cookies
 
// connect to mongodb
connectDB()

// Task Routes
app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)


// Base route
app.get("/", (req, res)=>{
    res.send("Task duty API is running!")
})

// START SERVER
const PORT = process.env.PORT || 8090

app.listen (
    PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);   
    });

export default app;