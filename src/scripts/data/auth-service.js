import CONFIG from "../config.js";
import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
} from "../utils/index.js";
import { postData, getData } from "./api.js";

class AuthService {
  async register(userData) {
    try {
      const response = await postData(
        CONFIG.API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await postData(
        CONFIG.API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      this.saveAuthData(response);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      await postData(CONFIG.API_ENDPOINTS.AUTH.LOGOUT, {}, true);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser() {
    try {
      const token = this.getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await getData(CONFIG.API_ENDPOINTS.AUTH.GET_USER, true);
      let userData = null;

      if (response && response.data && response.data.id) {
        userData = response.data;
      } else if (response && response.id) {
        userData = response;
      } else if (response && response.user) {
        userData = response.user;
      }

      if (userData && userData.id) {
        setToStorage(CONFIG.STORAGE_KEYS.USER_DATA, userData);
        return userData;
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  }

  saveAuthData(data) {
    if (data.token) {
      setToStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.token);
    }

    if (data.refreshToken) {
      setToStorage(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    }

    if (data.user) {
      setToStorage(CONFIG.STORAGE_KEYS.USER_DATA, data.user);
    }
  }

  clearAuthData() {
    removeFromStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    removeFromStorage(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    removeFromStorage(CONFIG.STORAGE_KEYS.USER_DATA);
  }

  getToken() {
    return getFromStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  }

  getRefreshToken() {
    return getFromStorage(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }

  getUserData() {
    return getFromStorage(CONFIG.STORAGE_KEYS.USER_DATA);
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
