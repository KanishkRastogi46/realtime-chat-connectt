import mongoose, { Document, Schema } from "mongoose";
import { User } from "./users.model";
import { Chat } from "./chats.model";

export interface Message extends Document {
    message: string,
    sender: User,
    receivers: User[],
    chat: Chat,
}

const messageSchema: Schema<Message> = new Schema<Message>({
    message: { type: String, required: true },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }],
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        required: true
    }
}, {
    timestamps: true,
})

const messageModel = mongoose.models.messages<Message> || mongoose.model<Message>("messages", messageSchema);
export default messageModel;