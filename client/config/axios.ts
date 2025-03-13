import axios from 'axios';
import { Platform } from 'react-native';

// Set the base URL to the new endpoint
// const getBaseUrl = () => {
//   if (Platform.OS === "android") {
//     return "http://10.0.2.2:3000";
//   } else if (Platform.OS === "ios") {
//     return "http://localhost:3000";
//   } else {
//     return "http://localhost:3000";
//   }
// };
const getBaseUrl = () => {
  return "https://nps-backend-1.onrender.com";
};

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  config => {
    console.log('Request:', config.method?.toUpperCase(), config.url, config.baseURL);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance; 