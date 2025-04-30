import { Request, Response } from "express";
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import messageModel from "../models/messages.model";
import userModel from "../models/users.model";
import { ApiResponse, ApiErrorResponse } from "../utils/apiResponse";


export const loadChatUsers = expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        /*
        sending the username of currently logged in user
        along with the list of users whom he/she is chatting with
        if the list is empty, then we will fetch all the users from the database
        */
        let { _id, username } = req.body.user as {_id: string, username: string };
        // const id = new mongoose.Types.ObjectId(_id);
        let chatUsersArr  = req.body.chatUsers as string[];

        if (chatUsersArr.length === 0) {
            /*
            fetching those messages 
            that are sent by the logged in user 
            or received by the logged in user
            and sorting them according to the time of creation
            in their latest order
            */
            let users = await messageModel.find({
                $or: [
                    { sender: _id },
                    { receiver: _id }
                ]
            })
            .sort({ createdAt: -1 })
            .populate("sender")
            .populate("receiver")
            .exec();

            /*
            if the list of users which whom the logged in user is chatting with is empty
            then we will fetch all the users from the database
            and return them to the client
            else we will create an array where we will store all the usernames
            of those users with whom the logged in user is chatting with
            and then insert it in a Set data structure to remove duplicates
            and then return the array to the client
            */
            if (users.length === 0) {
                users = await userModel.find({username: {$ne: username}}, {password: 0}).limit(10);
                return res.json(new ApiResponse(users, "No messages found, returning all users", true, 200));
            } else {
                const chatUsers = users.map((user: any) => {
                    return user.sender.username === username ? user.receiver : user.sender;
                });

                const uniqueChatUsers = new Set(chatUsers.map((user: any) => user.username));
                let usersArr = [];
                for (let username of uniqueChatUsers) {
                    let user = await userModel.findOne({username}, {password: 0});
                    if (user) {
                        usersArr.push(user);
                    }
                }
                // console.log(usersArr)
                return res.json(new ApiResponse(usersArr, "Chat users loaded successfully", true, 200));
            }
        } 
        // if the client already has the list of users with whom the logged in user is chatting with
        // then we will return the list of users to the client
        else  {
            return res.json(new ApiResponse(chatUsersArr, "Chat users loaded successfully", true, 200));
        }

    } catch (error: any) {
        console.log(error);
        return res.status(500).json(new ApiErrorResponse(error.messsage, 500));
    }
});


export const loadMessages = expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        let { sender, receiver } = req.body as { sender: string, receiver: string };
        let messages = await messageModel.find({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        })
        .sort({ createdAt: 1});

        if (messages.length === 0) {
            return res.json(new ApiResponse([], "No messages found", true, 200));
        }
        return res.json(new ApiResponse(messages, "Messages loaded successfully", true, 200));

    } catch (error: any) {
        console.log(error);
        return res.status(500).json(new ApiErrorResponse(error.messsage, 500));
    }
});

export const getCurrentMessage = expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        let { sender, receiver } = req.body as { sender: string, receiver: string };
        let messages = await messageModel.find({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        })
        .sort({ createdAt: -1})
        .limit(1);

        if (messages.length === 0) {
            return res.json(new ApiResponse([], "No messages found", true, 200));
        }
        return res.json(new ApiResponse(messages[0], "Messages loaded successfully", true, 200));

    } catch (error: any) {
        console.log(error);
        return res.status(500).json(new ApiErrorResponse(error.messsage, 500));
    }
});