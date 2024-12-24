import apiClient from "./apiClient";
import { currentUserID, logout, refresh } from "./authService";
import { isTokenExpired, getAccessToken, getRefreshToken } from "./secureStorage";

export const userDetails = async () => {
    try {
        const userID = await currentUserID();
        const response = await apiClient.get(`/api/Users/info/${userID}`)        
        if(response){
            return response.data;
        }
    } catch (error) {
        console.error('userDetails function error ', error)
        return null;
    }
    // const token = await getAccessToken();
    // const refreshToken = await getRefreshToken();
}

