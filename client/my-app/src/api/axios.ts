import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL;

export default axios.create({
    baseURL: API_BASE
})
export const axiosPrivate = axios.create({
    baseURL: API_BASE,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})