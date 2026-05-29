import axios from "axios";
export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_MODE=="development" ? 'http://localhost:3005/api' : "/api",
    withCredentials: true,
})