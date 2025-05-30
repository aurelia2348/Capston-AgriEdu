import CONFIG from "../../config.js";
import authService from "../../data/auth-service.js";

const CommunityModel = {
  async createPost(formData) {
    const url = `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.POSTS.CREATE}`;
    const token = authService.getToken();

    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();

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

      let postsArray = [];
      if (data.data && Array.isArray(data.data)) {
        postsArray = data.data;
      } else if (Array.isArray(data)) {
        postsArray = data;
      } else {
        console.warn("Unexpected response structure:", data);
        postsArray = [];
      }

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

      const responseText = await response.text();

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

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

      const responseText = await response.text();
      let data = { success: true };
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.warn("Failed to parse JSON response:", parseError);
        }
      }

      return data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

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

      const responseText = await response.text();

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

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const responseText = await response.text();

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

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
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

      return data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};

export default CommunityModel;
