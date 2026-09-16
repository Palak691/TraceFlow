import axios from 'axios'


// export const BASE_URL = 'https://shebeauty-1.onrender.com';

export const BASE_URL = 'http://localhost:8000';

export const clientServer = axios.create({
    baseURL : BASE_URL,
    withCredentials :  true
}); 
