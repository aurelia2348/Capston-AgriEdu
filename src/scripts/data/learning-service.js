import CONFIG from "../config.js";
import authService from "./auth-service.js";
import { postData, getData, updateData, deleteData } from "./api.js";

class LearningService {
  /**
   * Create a new learning material
   * @param {Object} learningData - The learning material data
   * @returns {Promise<Object>} - The created learning material
   */
  async createLearning(learningData) {
    try {
      const response = await postData(
        CONFIG.API_ENDPOINTS.LEARNING.CREATE,
        learningData,
        true
      );
      return response;
    } catch (error) {
      console.error("Create learning error:", error);
      throw error;
    }
  }

  /**
   * Get all learning materials
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - The learning materials
   */
  async getAllLearning(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${CONFIG.API_ENDPOINTS.LEARNING.GET_ALL}${
        queryString ? `?${queryString}` : ""
      }`;
      const response = await getData(url, true);
      return response;
    } catch (error) {
      console.error("Get all learning error:", error);
      throw error;
    }
  }

  /**
   * Get a specific learning material by ID
   * @param {string} id - The learning material ID
   * @returns {Promise<Object>} - The learning material
   */
  async getLearning(id) {
    try {
      const response = await getData(
        `${CONFIG.API_ENDPOINTS.LEARNING.GET_BY_ID}${id}`,
        true
      );
      return response;
    } catch (error) {
      console.error("Get learning error:", error);
      throw error;
    }
  }

  /**
   * Bookmark a learning material
   * @param {string} id - The learning material ID
   * @returns {Promise<Object>} - The updated learning material
   */
  async bookmarkLearning(id) {
    try {
      const response = await postData(
        `${CONFIG.API_ENDPOINTS.LEARNING.BOOKMARK}${id}/bookmark`,
        {},
        true
      );
      return response;
    } catch (error) {
      console.error("Bookmark learning error:", error);
      throw error;
    }
  }

  /**
   * Mark a learning material as read
   * @param {string} id - The learning material ID
   * @returns {Promise<Object>} - The updated learning material
   */
  async markAsRead(id) {
    try {
      const response = await postData(
        `${CONFIG.API_ENDPOINTS.LEARNING.MARK_AS_READ}${id}/mark-as-read`,
        {},
        true
      );
      return response;
    } catch (error) {
      console.error("Mark as read error:", error);
      throw error;
    }
  }
}

export default new LearningService();
