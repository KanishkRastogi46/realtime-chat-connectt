import {create} from "zustand";

interface User {
    _id: string,
    username: string,
    email: string,
    status: string,
    createdAt?: Date,
    updatedAt?: Date
}

interface UserStore {
    user: User,
    onlineUsers: User[],
    inboxChatUsers: User[],
    setOnlineUsers: (onlineUsers: User[])=>void,
    setInboxChatUsers: (inbox: User[])=>void,
    setUser: (_id: string, username: string, email: string, status: string)=>void
}

const userStore = create<UserStore>()((set)=>{
    return {
        user: {
            _id: "",
            username: "",
            email: "",
            status: "Offline"
        },
        onlineUsers: [],
        inboxChatUsers: [],
        setOnlineUsers: (onlineUsers: User[]) => set({onlineUsers: onlineUsers}),
        setInboxChatUsers: (inbox: User[]) => set({inboxChatUsers: inbox}),
        setUser: (_id: string, username: string, email: string, status: string = "Offline") => set({
            user: {
                _id: _id,
                username: username,
                email: email,
                status: status
            }
        })
    }
})

export default userStore;