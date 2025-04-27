import mongoose, {Document, Schema} from "mongoose";
import { User } from "./users.model";
import { Message } from "./messages.model";

export interface Chat extends Document {
    chat: string,
    users: User[],
    messages: Message[],
}

const chatSchema: Schema<Chat> = new Schema<Chat>({
    chat: {type: String, required: true},
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages"
    }]
}, {
    timestamps: true,
})

const chatModel = mongoose.models.chats<Chat> || mongoose.model<Chat>("chats", chatSchema);
export default chatModel;

