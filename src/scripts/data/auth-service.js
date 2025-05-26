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
      const response = await postData(CONFIG.API_ENDPOINTS.AUTH.REGISTER, userData);
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      // Kirim data login ke backend
      const response = await postData(CONFIG.API_ENDPOINTS.AUTH.LOGIN, credentials);

      // Simpan token dan user data ke localStorage
      this.saveAuthData(response);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      // Kirim request logout ke backend (pakai token)
      await postData(CONFIG.API_ENDPOINTS.AUTH.LOGOUT, {}, true);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Bersihkan data lokal apapun yang terjadi
      this.clearAuthData();
    }
  }

async getCurrentUser() {
  try {
    const token = this.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Ambil data user dari backend
    const response = await getData(CONFIG.API_ENDPOINTS.AUTH.GET_USER, true);

    // Kalau response langsung user object
    if (response && response.id) {
      setToStorage(CONFIG.STORAGE_KEYS.USER_DATA, response);
      return response;
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
