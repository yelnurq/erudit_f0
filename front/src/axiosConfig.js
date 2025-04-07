import axios from 'axios';

// Create an axios instance with the base URL set
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // Set your base URL here
});

export default axiosInstance;
