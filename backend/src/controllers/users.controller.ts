import expressAsyncHandler from "express-async-handler";
import { Request , Response , NextFunction } from "express";
import usersModel from "../models/users.model";
import { validationResult } from "express-validator";
import { hash , compare } from "bcryptjs";
import { sign , verify } from "jsonwebtoken";
import {ApiResponse, ApiErrorResponse} from "../utils/apiResponse"


export const register = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) : Promise<any>=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let msg: string[] = []
        for (let obj of errors.array()) msg.push(obj.msg)
        return res.json(new ApiResponse(undefined, msg.join(", "), false, 400));
    }
    console.log(req.body);
    const {username, email, password} = req.body;

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
    let errors = validationResult(req);
    // console.log(errors.array())
    if (!errors.isEmpty()) {
        let msg: string[] = []
        for (let obj of errors.array()) msg.push(obj.msg)
        return res.json(new ApiResponse(undefined, msg.join(", "), false, 400));
    }

    const {email , password} = req.body;
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
    if (!req.body.user) return res.json(new ApiResponse(undefined, "Unauthorized user", false, 401));
    else return res.status(201).json(new ApiResponse(req.body.user, "User profile", true, 200));
})


export const logout = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    if (!req.body.user) return res.json(new ApiResponse(undefined, "Unauthorized user", false, 401));
    else return res.clearCookie("accesstoken").json(new ApiResponse(undefined, "User logged out", true, 200));
})