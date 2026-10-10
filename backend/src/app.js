import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}))

app.use(express.json());
app.use(cookieParser());

export default app;