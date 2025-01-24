import * as SecureStorage from 'expo-secure-store'

const ACCESS_TOKEN = "usertoken"
const REFRESH_TOKEN = "refreshtoken"

export const storeTokens = async (accessToken, refreshToken) => {
    try {
        await SecureStorage.setItemAsync(ACCESS_TOKEN, accessToken)
        await SecureStorage.setItemAsync(REFRESH_TOKEN, refreshToken)
        // console.log(accessToken)
    } catch (error) {
        console.error('Error in storing token', error)
    }
}

export const getAccessToken = async () => {
    try {
        const token = await SecureStorage.getItemAsync(ACCESS_TOKEN)
        
        return token;
    } catch (error) {
        console.error('Error retrieving access token', error);
    }
}

export const getRefreshToken = async () => {
    try {
        const token = await SecureStorage.getItemAsync(REFRESH_TOKEN)
        // console.log(REFRESH_TOKEN);

        return token
    } catch (error) {
        console.error("error retrieving refreshtoken", error);
        
    }
}

export const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
};

export const removeTokens = async () => {
    try {
        await SecureStorage.deleteItemAsync(ACCESS_TOKEN);
        await SecureStorage.deleteItemAsync(REFRESH_TOKEN);
    } catch (error) {
        console.error('Error deleting tokens', error);
    }
}