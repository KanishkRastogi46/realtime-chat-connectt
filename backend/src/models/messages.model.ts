import mongoose, { Document, Schema } from "mongoose";
import { User } from "./users.model";

export interface Message extends Document {
    text: string,
    file: string,
    sender: User,
    receiver: User
}

const messageSchema: Schema<Message> = new Schema<Message>({
    text: String,
    file: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
}, {
    timestamps: true,
})

const messageModel = mongoose.models.messages<Message> || mongoose.model<Message>("messages", messageSchema);
export default messageModel;