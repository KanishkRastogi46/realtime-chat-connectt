import {createStore} from "zustand";

interface User {
    username: string,
    email: string,
    status: string
}

interface UserStore {
    user: User,
    setUser: (username: string, email: string, status: string)=>void
}

const userStore = createStore<UserStore>()((set)=>{
    return {
        user: {
            username: "",
            email: "",
            status: "Offline"
        },

        setUser: (username: string, email: string, status: string = "Offline") => set({
            user: {
                username: username,
                email: email,
                status: status
            }
        })
    }
})

export default userStore;