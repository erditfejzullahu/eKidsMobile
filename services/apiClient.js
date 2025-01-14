import axios from 'axios'
import { getAccessToken, getRefreshToken, removeTokens } from './secureStorage'
import { logout, refresh } from './authService';
import { Alert } from 'react-native';
import NotifierComponent from '../components/NotifierComponent';

const API_URL = 'https://dove-well-officially.ngrok-free.app'

const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const {showNotification} = NotifierComponent({
    title: "Sesioni juaj ka mbaruar!",
    alertType: "error",
    description: "Ju lutem kyçuni përsëri"
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await getRefreshToken();
                const refSuccess = await refresh(refreshToken)
                // console.log('refresh tkoeni nga apiclient interceptori ', refreshToken);
                

                if (refSuccess) {
                    const newAccessToken = await getAccessToken();

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return apiClient(originalRequest);
                } else {
                    await logout();
                    showNotification()
                }
            } catch (error) {
                // console.error('Refreshin token error', error);
                showNotification()
                router.replace('/sign-in');
            }
            
        }
        return Promise.reject(error);
    }
)

export default apiClient;