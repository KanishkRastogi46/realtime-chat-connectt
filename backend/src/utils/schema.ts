import { z } from "zod";


export const userRegisterSchema = z.object({
    username: z.string().min(3, {message: "Username should be minimum 3 characters"}).max(20,  {message: "Username shouldn't be maximum 20 characters"}).trim(),
    email: z.string().email({message: "Email is not valid"}).trim(),
    password: z.string().min(6, {message: "Password should be minimum 6 characters"}).max(20, {message: "Password shouldn't be maximum 20 characters"}).trim()
})

export const userLoginSchema = z.object({
    email: z.string().email({message: "Email is not valid"}).trim(),
    password: z.string().min(6, {message: "Password should be minimum 6 characters"}).max(20, {message: "Password shouldn't be maximum 20 characters"}).trim()
})