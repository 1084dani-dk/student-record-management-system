
import axios from 'axios';

const API_URL = '/api';

// Admin Login
export const loginAdmin = async (credentials) => {
    const response = await axios.post(
        `${API_URL}/login.php`,
        credentials,
        { withCredentials: true }
    );

    return response.data;
};

// Check Admin Session
export const checkAuth = async () => {
    const response = await axios.get(
        `${API_URL}/check_auth.php`,
        { withCredentials: true }
    );

    return response.data;
};

// Admin Logout
export const logoutAdmin = async () => {
    const response = await axios.post(
        `${API_URL}/logout.php`,
        {},
        { withCredentials: true }
    );

    return response.data;
};
