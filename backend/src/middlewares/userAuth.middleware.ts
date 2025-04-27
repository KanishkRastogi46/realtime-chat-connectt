import { Request ,  Response , NextFunction } from "express";
import { verify } from "jsonwebtoken";
import usersModel from "../models/users.model";
import { ApiResponse, ApiErrorResponse } from "../utils/apiResponse";

interface UserData {
    username: string,
    email: string,
    status: "Online" | "Offline",
}

declare global {
    namespace Express {
        interface Request {
            user: UserData | null;
        }
    } 
}

export default async function protectedRoute(req: Request, res: Response, next: NextFunction) : Promise<any> {
    try {
        let token = req.cookies.accesstoken || req.headers.authorization?.split(" ")[1];
        console.log(token)
        if (!token) return res.json(new ApiResponse(undefined, "Token not provided", false, 400));
        
        let user : any = verify(token , String(process.env.JWT_SECRET));
        let getUser = await usersModel.findById({_id: user._id}).select("_id email fullname");
        if (!getUser) return res.json(new ApiResponse(undefined, "User not found", false, 404));
        req.user = getUser;
        next();
    } catch (error: any) {
        console.log(error);
        return res.status(500).json(new ApiErrorResponse(error.message, 500));
    }
}