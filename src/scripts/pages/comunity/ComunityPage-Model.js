import CONFIG from "../../config.js";
import authService from "../../data/auth-service.js";

const CommunityModel = {
  async createPost(formData) {
    const url = `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.POSTS.CREATE}`;
    const token = authService.getToken();

    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    console.log("Creating post with API:", url);
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formData,
      });

      console.log("Create post response status:", response.status);

      const responseText = await response.text();
      console.log("Create post response text:", responseText);

      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn("Failed to parse JSON response:", parseError);
        throw new Error("Server returned invalid response");
      }

      if (!response.ok) {
        switch (response.status) {
          case 401:
            authService.clearAuthData();
            throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
          case 403:
            throw new Error("Anda tidak memiliki izin untuk membuat post.");
          case 413:
            throw new Error("File yang diunggah terlalu besar.");
          case 422:
            throw new Error(data.message || "Data yang dikirim tidak valid.");
          case 500:
            throw new Error(
              "Terjadi kesalahan pada server. Silakan coba lagi."
            );
          default:
            throw new Error(
              data.message || `Gagal membuat post. Status: ${response.status}`
            );
        }
      }

      console.log("Post created successfully:", data);
      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error("Error in createPost:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      }
      throw error;
    }
  },

  async getAllPosts() {
    const url = `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.POSTS.GET_ALL}`;
    const token = authService.getToken();

    console.log("Fetching posts from:", url);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Posts API response:", data);

      // Handle different response structures based on API schema
      let postsArray = [];
      if (data.data && Array.isArray(data.data)) {
        postsArray = data.data;
      } else if (Array.isArray(data)) {
        postsArray = data;
      } else {
        console.warn("Unexpected response structure:", data);
        postsArray = [];
      }

      console.log(`Found ${postsArray.length} posts`);

      return {
        success: true,
        data: postsArray,
      };
    } catch (error) {
      console.error("Error in getAllPosts:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      }
      throw error;
    }
  },

  async getPostById(postId) {
    const url = `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.POSTS.GET_BY_ID}${postId}`;
    const token = authService.getToken();

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      console.log("Get post by ID response status:", response.status);
      const responseText = await response.text();
      console.log("Get post by ID response text:", responseText);

      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn("Failed to parse JSON response:", parseError);
        data = { rawResponse: responseText };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Gagal mengambil detail post. Status: ${response.status}`
        );
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error("Error in getPostById:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      }
      throw error;
    }
  },

  async deletePost(postId) {
    const url = `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.POSTS.DELETE}${postId}`;
    const token = authService.getToken();

    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    console.log("Deleting post with ID:", postId);
    console.log("Delete API URL:", url);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete error response:", errorText);

        let errorData = {};
        try {
          errorData = errorText ? JSON.parse(errorText) : {};
        } catch (parseError) {
          console.warn("Failed to parse error JSON response:", parseError);
        }

        switch (response.status) {
          case 401:
            authService.clearAuthData();
            throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
          case 403:
            throw new Error(
              "Anda tidak memiliki izin untuk menghapus post ini."
            );
          case 404:
            throw new Error("Post tidak ditemukan.");
          default:
            throw new Error(
              errorData.message || `Gagal menghapus post: ${response.status}`
            );
        }
      }

      // For DELETE request, response might be empty
      const responseText = await response.text();
      let data = { success: true };
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.warn("Failed to parse JSON response:", parseError);
        }
      }

      console.log("Post deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Comments API functions
  async getComments(postId) {
    const url = `${
      CONFIG.BASE_URL
    }${CONFIG.API_ENDPOINTS.COMMENTS.GET_ALL.replace("{postId}", postId)}`;
    const token = authService.getToken();

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      console.log("Get comments response status:", response.status);
      const responseText = await response.text();
      console.log("Get comments response text:", responseText);

      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn("Failed to parse JSON response:", parseError);
        data = { rawResponse: responseText };
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Gagal mengambil komentar. Status: ${response.status}`
        );
      }

      return {
        success: true,
        data: data.data || data || [],
      };
    } catch (error) {
      console.error("Error in getComments:", error);
      throw error;
    }
  },

  async createComment(postId, content) {
    const url = `${
      CONFIG.BASE_URL
    }${CONFIG.API_ENDPOINTS.COMMENTS.CREATE.replace("{postId}", postId)}`;
    const token = authService.getToken();

    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    console.log("Creating comment for post:", postId);
    console.log("Comment content:", content);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      console.log("Create comment response status:", response.status);
      const responseText = await response.text();
      console.log("Create comment response text:", responseText);

      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn("Failed to parse JSON response:", parseError);
        throw new Error("Server returned invalid response");
      }

      if (!response.ok) {
        switch (response.status) {
          case 401:
            authService.clearAuthData();
            throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
          case 403:
            throw new Error(
              "Anda tidak memiliki izin untuk menambah komentar."
            );
          case 404:
            throw new Error("Post tidak ditemukan.");
          case 422:
            throw new Error(data.message || "Komentar tidak valid.");
          default:
            throw new Error(
              data.message ||
                `Gagal menambah komentar. Status: ${response.status}`
            );
        }
      }

      console.log("Comment created successfully:", data);
      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error("Error in createComment:", error);
      throw error;
    }
  },

  async deleteComment(postId, commentId) {
    const url = `${
      CONFIG.BASE_URL
    }${CONFIG.API_ENDPOINTS.COMMENTS.DELETE.replace("{postId}", postId).replace(
      "{commentId}",
      commentId
    )}`;
    const token = authService.getToken();

    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    console.log("Deleting comment:", commentId, "from post:", postId);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete comment response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete comment error response:", errorText);

        let errorData = {};
        try {
          errorData = errorText ? JSON.parse(errorText) : {};
        } catch (parseError) {
          console.warn("Failed to parse error JSON response:", parseError);
        }

        switch (response.status) {
          case 401:
            authService.clearAuthData();
            throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
          case 403:
            throw new Error(
              "Anda tidak memiliki izin untuk menghapus komentar ini."
            );
          case 404:
            throw new Error("Komentar tidak ditemukan.");
          default:
            throw new Error(
              errorData.message ||
                `Gagal menghapus komentar: ${response.status}`
            );
        }
      }

      const responseText = await response.text();
      let data = { success: true };
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.warn("Failed to parse JSON response:", parseError);
        }
      }

      console.log("Comment deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};

export default CommunityModel;
