import mongoose from "mongoose";

interface User{
    userId: mongoose.Types.ObjectId;
    username: string;
}
declare module "express-session" {
    interface SessionData {
        user: User;
    }
}