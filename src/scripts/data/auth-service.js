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
      console.log("Mock register:", userData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse = {
        user: {
          id: "mock-user-id-" + Date.now(),
          username: userData.username,
          email: userData.email,
          createdAt: new Date().toISOString(),
        },
      };

      return mockResponse;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      console.log("Mock login:", credentials);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse = {
        user: {
          id: "mock-user-id-123",
          username: "mockuser",
          email: credentials.email,
        },
        token: "mock-token-" + Date.now(),
      };

      this.saveAuthData(mockResponse);

      return mockResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      console.log("Mock logout");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser() {
    try {
      console.log("Mock getCurrentUser");

      const token = this.getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const userData = this.getUserData();

      if (!userData) {
        throw new Error("User data not found");
      }

      return userData;
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
