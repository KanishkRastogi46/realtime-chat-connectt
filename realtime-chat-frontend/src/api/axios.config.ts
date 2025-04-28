import axios from 'axios';

const apiInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1/", 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

export default apiInstance;