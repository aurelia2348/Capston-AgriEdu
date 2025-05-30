import CONFIG from "../config.js";
import authService from "./auth-service.js";

const imageCache = new Map();

class ProfilePictureService {
  async uploadProfilePicture(file) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch(
        `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.ACCOUNT.UPLOAD_PROFILE_PICTURE}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to upload profile picture"
        );
      }

      const userData = await response.json();

      const existingToken = authService.getToken();
      const existingRefreshToken = authService.getRefreshToken();

      authService.saveAuthData({
        user: userData,
        token: existingToken,
        refreshToken: existingRefreshToken,
      });

      return userData;
    } catch (error) {
      console.error("Profile picture upload error:", error);
      throw error;
    }
  }

  async deleteProfilePicture() {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${CONFIG.BASE_URL}${CONFIG.API_ENDPOINTS.ACCOUNT.DELETE_PROFILE_PICTURE}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete profile picture"
        );
      }

      const userData = await response.json();

      const existingToken = authService.getToken();
      const existingRefreshToken = authService.getRefreshToken();

      authService.saveAuthData({
        user: userData,
        token: existingToken,
        refreshToken: existingRefreshToken,
      });

      return userData;
    } catch (error) {
      console.error("Profile picture delete error:", error);
      throw error;
    }
  }

  async fetchProfilePictureByFilename(filename) {
    try {
      if (!filename) {
        throw new Error("Filename is required");
      }

      const response = await fetch(
        `${CONFIG.BASE_URL}/api/account/profile-picture/${filename}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile picture: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Profile picture fetch error:", error);
      throw error;
    }
  }

  getProfilePictureUrl(profilePictureUrl) {
    if (!profilePictureUrl) {
      return null;
    }

    if (
      profilePictureUrl.startsWith("http://") ||
      profilePictureUrl.startsWith("https://")
    ) {
      return profilePictureUrl;
    }

    const filename = profilePictureUrl.split("/").pop();

    return `${CONFIG.BASE_URL}/api/account/profile-picture/${filename}`;
  }

  async isProfilePictureAccessible(profilePictureUrl) {
    try {
      const fullUrl = this.getProfilePictureUrl(profilePictureUrl);
      if (!fullUrl) {
        return false;
      }

      const response = await fetch(fullUrl, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.warn("Profile picture accessibility check failed:", error);
      return false;
    }
  }

  createFallbackAvatar(username, size = "medium") {
    const initial = (username || "U").charAt(0).toUpperCase();
    const sizeClasses = {
      small: "width: 40px; height: 40px; font-size: 16px;",
      medium: "width: 80px; height: 80px; font-size: 24px;",
      large: "width: 120px; height: 120px; font-size: 36px;",
    };

    return `
      <div class="author-avatar fallback-avatar ${size}" style="
        ${sizeClasses[size]}
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: bold;
      ">
        ${initial}
      </div>
    `;
  }

  createProfilePictureElement(
    profilePictureUrl,
    username,
    size = "medium",
    additionalClasses = ""
  ) {
    const fullUrl = this.getProfilePictureUrl(profilePictureUrl);
    const classes = `author-avatar ${size} ${additionalClasses}`.trim();

    if (fullUrl) {
      return `<img src="${fullUrl}" alt="${
        username || "User"
      } Profile Picture" class="${classes}" onerror="this.onerror=null; this.style.display='none'; this.parentNode.innerHTML += '${this.createFallbackAvatar(
        username,
        size
      ).replace(/'/g, "\\'")}';">`;
    } else {
      return this.createFallbackAvatar(username, size);
    }
  }

  async updateImageElement(imgElement, profilePictureUrl, username) {
    if (!imgElement) {
      console.warn(
        "ProfilePictureService.updateImageElement: No image element provided"
      );
      return;
    }

    const existingFallbacks =
      imgElement.parentNode.querySelectorAll(".fallback-avatar");
    existingFallbacks.forEach((fallback) => fallback.remove());

    const fullUrl = this.getProfilePictureUrl(profilePictureUrl);

    if (fullUrl) {
      try {
        const imageBlob = await this.fetchImageWithAuth(fullUrl);

        if (imageBlob) {
          const blobUrl = URL.createObjectURL(imageBlob);

          imgElement.onerror = null;
          imgElement.onload = () => {
            URL.revokeObjectURL(blobUrl);
          };

          imgElement.src = blobUrl;
          imgElement.alt = `${username || "User"} Profile Picture`;
          imgElement.style.display = "block";
          return;
        }
      } catch (error) {
        console.warn(
          "Failed to fetch profile picture with auth, trying direct load:",
          error
        );
        imgElement.onerror = () => {
          console.warn("Direct image load also failed, using fallback avatar");
          this.showFallbackAvatar(imgElement, username);
        };

        imgElement.src = fullUrl;
        imgElement.alt = `${username || "User"} Profile Picture`;
        imgElement.style.display = "block";
        return;
      }
    }

    this.showFallbackAvatar(imgElement, username);
  }

  async fetchImageWithAuth(imageUrl) {
    try {
      if (imageCache.has(imageUrl)) {
        return imageCache.get(imageUrl);
      }

      const token = authService.getToken();
      const headers = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(imageUrl, {
        method: "GET",
        headers: headers,
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      imageCache.set(imageUrl, blob.slice(0));
      return blob;
    } catch (error) {
      console.warn("Failed to fetch image with auth:", error);
      return null;
    }
  }

  showFallbackAvatar(imgElement, username) {
    imgElement.style.display = "none";
    imgElement.onerror = null;

    const fallbackHtml = this.createFallbackAvatar(username);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = fallbackHtml;
    const fallbackElement = tempDiv.firstElementChild;

    imgElement.parentNode.insertBefore(fallbackElement, imgElement);
  }

  updateContainerElement(
    containerElement,
    profilePictureUrl,
    username,
    size = "medium"
  ) {
    if (!containerElement) return;

    const profilePictureHtml = this.createProfilePictureElement(
      profilePictureUrl,
      username,
      size
    );
    containerElement.innerHTML = profilePictureHtml;
  }

  async updateContainerElementSafe(
    containerElement,
    profilePictureUrl,
    username,
    size = "medium"
  ) {
    if (!containerElement) return;

    const fallbackHtml = this.createFallbackAvatar(username, size);
    containerElement.innerHTML = fallbackHtml;

    if (profilePictureUrl) {
      try {
        const fullUrl = this.getProfilePictureUrl(profilePictureUrl);
        const imageBlob = await this.fetchImageWithAuth(fullUrl);

        if (imageBlob) {
          const img = document.createElement("img");
          const blobUrl = URL.createObjectURL(imageBlob);

          img.onload = () => {
            containerElement.innerHTML = "";
            containerElement.appendChild(img);
            URL.revokeObjectURL(blobUrl);
          };

          img.onerror = () => {
            console.warn("Failed to load profile picture, keeping fallback");
            URL.revokeObjectURL(blobUrl);
          };

          img.src = blobUrl;
          img.alt = `${username} Profile Picture`;
          img.className = `author-avatar ${size}`;
        }
      } catch (error) {
        console.warn("Failed to fetch profile picture:", error);
      }
    }
  }
}

export default new ProfilePictureService();
