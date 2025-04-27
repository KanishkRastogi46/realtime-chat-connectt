import mongoose, {Document, Schema} from "mongoose";


export interface User extends Document {
    username: string,
    email: string,
    password: string,
    status: string
}

const userSchema: Schema<User> = new Schema<User>({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    status: {type: String, enum: ["online", "offline"], default: "offline"}
}, {
    timestamps: true,
})

const userModel = mongoose.models.users<User> || mongoose.model<User>("users", userSchema);
export default userModel;