import mongoose, {Document, Schema} from "mongoose";


interface Chat extends Document {}

const chatSchema: Schema<Chat> = new Schema<Chat>({})

const chatModel = mongoose.models.chats<Chat> || mongoose.model<Chat>("chats", chatSchema);
export default chatModel;

