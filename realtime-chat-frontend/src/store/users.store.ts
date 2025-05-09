import {create} from "zustand";

export interface User {
    _id: string,
    username: string,
    email: string,
    status: string,
    createdAt?: Date,
    updatedAt?: Date
}

interface UserStore {
    user: User,
    onlineUsers: string[],
    inboxChatUsers: User[],
    selectedUser: User,
    setOnlineUsers: (onlineUsers: string[])=>void,
    setInboxChatUsers: (inbox: User[])=>void,
    setUser: (_id: string, username: string, email: string, status: string)=>void,
    setSelectedUser: (user: User)=>void
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
        selectedUser: {
            _id: "",
            username: "",
            email: "",
            status: "Offline"
        },
        setOnlineUsers: (onlineUsers: string[]) => set({onlineUsers: onlineUsers}),
        setInboxChatUsers: (inbox: User[]) => set({inboxChatUsers: inbox}),
        setUser: (_id: string, username: string, email: string, status: string = "Offline") => set({
            user: {
                _id: _id,
                username: username,
                email: email,
                status: status
            }
        }),
        setSelectedUser: (user: User) => set({selectedUser: user}),
    }
})

export default userStore;