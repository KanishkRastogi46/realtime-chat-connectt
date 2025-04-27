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


/* 
validating the request to check whether the user is authenticated or not
by checking whether the token is present in the request or not
if the token is present then verify the token and get the user data from the token
and then check whether the user exists in the database or not
if the user exists then set the user data in the request and call the next middleware
if the user doesn't exist then return the response with message "User not found"
*/
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