import CONFIG from "../../config.js";
import authService from "../../data/auth-service.js";

const CommunityModel = {
  async createPost(formData) {
    const url = `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.POSTS.CREATE}`;
    const token = authService.getToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,  
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal membuat post.");
    }

    return data;
  },
};

export default CommunityModel;
