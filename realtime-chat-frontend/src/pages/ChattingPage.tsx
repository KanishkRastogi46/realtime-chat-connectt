import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import userStore from '../store/users.store';
import apiInstance from '../api/axios.config';


const ChattingPage: React.FC = () => {
    const user = userStore(state => state.user);
    console.log(user);

    const socket = useMemo(() => io("http://localhost:3000"), []);
    const [socketId, setSocketId] = useState<string | null>();
    console.log(socketId);

    const navigate = useNavigate();

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server with id: " + socket.id);
            setSocketId(socket.id);
        });

        return () => {
            socket.disconnect();
            console.log("Disconnected from server with id: " + socket.id);
        };
    }, 
    [])

    const fetchUser = async function() {
        try {
            let response = await apiInstance.get("/auth/profile")
            if (response.data.success === false) navigate("/signin");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <>
            <h1>Chatting Page</h1>
        </>
    )
}

export default ChattingPage;