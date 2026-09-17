import axios from 'axios'


export const BASE_URL = 'https://traceflow-564f.onrender.com';






export const clientServer = axios.create({
    baseURL : BASE_URL,
    withCredentials :  true
}); 
