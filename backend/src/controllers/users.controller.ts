import expressAsyncHandler from "express-async-handler";
import { Request , Response , NextFunction } from "express";
import usersModel from "../models/users.model";
import { hash , compare } from "bcryptjs";
import { sign , verify } from "jsonwebtoken";
import {ApiResponse, ApiErrorResponse} from "../utils/apiResponse";
import { userRegisterSchema, userLoginSchema } from "../utils/schema";


export const register = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) : Promise<any>=>{
    
    console.log(req.body);
    const {username, email, password} = req.body;

    // Validation check for user registration
    const checkData = userRegisterSchema.safeParse({username, email, password});
    if (!checkData.success) {
        const errors = checkData.error.errors.map((error) => error.message);
        return res.json(new ApiResponse(undefined, errors.join(", "), false, 400));
    }

    /*
    first check whether the user already exists or not
    if the user exists then return the response with message "User already exists"
    if the user doesn't exist then create the user and return the response with message "User created successfully"
    and also create a refresh token and send it in the cookie
    */
    try {
        const findUser = await usersModel.findOne({email});
        if (findUser) return res.json(new ApiResponse(undefined, "User already exists", false, 202));
        
        const hashedPassword = await hash(password , 10);
        const newUser = await usersModel.create({
            username,
            email,
            password: hashedPassword
        });
        let refreshToken = sign({_id: newUser._id}, String(process.env.JWT_SECRET), {expiresIn: '7d'});
        
        let getUser = await usersModel.findById({_id: newUser._id}).select("-password");
        return res.status(201).cookie('usertoken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            domain: "localhost",
            sameSite: (process.env.NODE_ENV === 'production') ? "none" : true
        }).json(new ApiResponse(getUser, "User created successfully", true, 201));
    } catch (err: any) {
        console.log(err);
        return res.json(new ApiErrorResponse(err.message, 500))
    }
})


export const login = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) : Promise<any>=> {
    

    const {email , password} = req.body;

    // Validation check for user login
    const checkData = userLoginSchema.safeParse({email, password});
    if (!checkData.success) {
        const errors = checkData.error.errors.map((error) => error.message);
        return res.json(new ApiResponse(undefined, errors.join(", "), false, 400));
    }

    /*
    first check whether the user exists or not
    then match the password with the hashed password in the database
    if the password matches then check if the user has a refresh token or not
    if the user has a refresh token then create a new access token and send it in the cookie
    if the user doesn't have a refresh token then create a new refresh token & access token and send it in the cookie
    */
    try {
        let findUser = await usersModel.findOne({email});
        if (!findUser) return res.json(new ApiResponse(undefined, "User not found", false, 404));

        let isPasswordCorrect = await compare(password, findUser.password);
        if (!isPasswordCorrect) return res.json(new ApiResponse(undefined, "User not found", false, 404));

        let token = req.cookies.usertoken || req.headers.authorization?.split(" ")[1];
        let refreshToken = null;
        if (token) refreshToken = verify(token, String(process.env.JWT_SECRET));
        if (refreshToken) {
            let accessToken = sign({_id: findUser._id, email: findUser.email}, String(process.env.JWT_SECRET), {expiresIn: '24h'})

            let getUser = await usersModel.findById({_id: findUser._id}).select("-password");
            res.status(200).cookie('accesstoken', accessToken, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                domain: "localhost",
            sameSite: (process.env.NODE_ENV === 'production') ? "none" : true
            }).json(new ApiResponse(getUser, "User logged in successfully", true, 200))
        } else {
            let newRefreshToken = sign({_id: findUser._id}, String(process.env.JWT_SECRET), {expiresIn: '7d'});
            let accessToken = sign({_id: findUser._id, email: findUser.email}, String(process.env.JWT_SECRET), {expiresIn: '24h'});
            
            let getUser = await usersModel.findById({_id: findUser._id}).select("-password");
            res.status(200).cookie('usertoken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                domain: "localhost",
                sameSite: (process.env.NODE_ENV === 'production') ? "none" : true
            }).cookie('accesstoken', accessToken, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                domain: "localhost",
                sameSite: (process.env.NODE_ENV === 'production') ? "none" : true
            }).json(new ApiResponse(getUser, "User logged in successfully", true, 200));
        }
    } catch (err: any) {
        console.log(err);
        res.json(new ApiErrorResponse(err.message, 500));
    }
})


export const profile = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    if (!req.user) return res.json(new ApiResponse(undefined, "Unauthorized user", false, 401));
    else return res.status(201).json(new ApiResponse(req.user, "User profile", true, 200));
})


export const logout = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    if (!req.user) return res.json(new ApiResponse(undefined, "Unauthorized user", false, 401));
    else return res.clearCookie("accesstoken").json(new ApiResponse(undefined, "User logged out", true, 200));
})