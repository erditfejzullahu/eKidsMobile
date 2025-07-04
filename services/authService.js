import axios from "axios";
import { storeTokens, removeTokens, isTokenExpired } from "./secureStorage";
// import apiClient from "./apiClient";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "./secureStorage";
import { router } from "expo-router";

const API_URL = 'https://dove-well-officially.ngrok-free.app'
// axios.defaults.httpsAgent = new https.Agent({  
//     rejectUnauthorized: false  
// });
axios.interceptors.request.use(config => {
    
    // Disable SSL certificate verification for development (unsafe for production)
    config.headers['ssl-disable'] = 'true'; // Custom header workaround (Optional)
    return config;
  }, error => {
    return Promise.reject(error);
  });
  
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password,
        });
        // console.log(response.data.token);
        const { accessToken, refreshToken } = response.data.token;
        
        if(accessToken && refreshToken){
            await storeTokens(accessToken, refreshToken)
            return true;
        }
        return false;
        // return true;
    } catch (error) {
        console.error(error);        
        return false
    }
};

export const register = async (email, username, firstname, lastname, password, age, role) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            email,
            username,
            firstname,
            lastname,
            password,
            age,
            role
        })
        await login(username, password);
    } catch (error) {
        throw error.response?.data || "Registration failed!";
    }
}

export const refresh = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/api/Users/refresh`, {
            'token': refreshToken
        })
        if(response?.data){
            await storeTokens(response?.data?.accessToken, response?.data?.refreshToken);
            return true;
        }else{
            await logout();
            return false;
        }
    } catch (error) {
        await logout();
        console.error('error getting refershToken', error);
        return false;
    }
}

// export const userDetails = async () => {
//     try {
//         const token = getAccessToken();
//         const decodedToken = jwtDecode(token);
//         const userID = decodedToken.sub;
//         const response = await apiClient.get(`/api/Users/info/${userID}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error in getting users details', error);
//     }
// }

export const currentUserID = async () => {
    const token = await getAccessToken();
    // console.log('token', token);
    if(token){
        try {
            const decodedToken = jwtDecode(token);
            const userID = decodedToken.sub;    
            return userID;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }
    return null;
}

export const getRole = async () => {
    const token = await getAccessToken()
    if(token){
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.Role;
        } catch (error) {
            console.error("error getting role", error);
            return null;
        }
    }
    return null;
}

export const logout = async () => {
    try {
        await removeTokens();
    } catch (error) {
        console.error("Error during logout", error);
    }
}