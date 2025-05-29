import CONFIG from "../config.js";
import authService from "./auth-service.js";

class ProfilePictureService {
  /**
   * Upload a profile picture to the API
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} - Updated user data with new profile picture URL
   */
  async uploadProfilePicture(file) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Create FormData for multipart upload
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

      // Update stored user data while preserving existing tokens
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

  /**
   * Delete the current user's profile picture
   * @returns {Promise<Object>} - Updated user data without profile picture
   */
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

      // Update stored user data while preserving existing tokens
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

  /**
   * Fetch a profile picture by filename (for any user)
   * @param {string} filename - The profile picture filename
   * @returns {Promise<Blob>} - The image blob data
   */
  async fetchProfilePictureByFilename(filename) {
    try {
      if (!filename) {
        throw new Error("Filename is required");
      }

      const response = await fetch(
        `${CONFIG.BASE_URL}/api/account/profile-picture/${filename}`,
        {
          method: "GET",
          // No authentication required for public profile pictures
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

  /**
   * Get the full URL for a profile picture
   * @param {string} profilePictureUrl - The profile picture URL from user data
   * @returns {string|null} - Full URL to the profile picture or null if none
   */
  getProfilePictureUrl(profilePictureUrl) {
    if (!profilePictureUrl) {
      return null;
    }

    // If it's already a full URL, return as is
    if (
      profilePictureUrl.startsWith("http://") ||
      profilePictureUrl.startsWith("https://")
    ) {
      return profilePictureUrl;
    }

    // Extract filename from the URL if it contains the full path
    const filename = profilePictureUrl.split("/").pop();

    // Construct full URL using the API schema
    return `${CONFIG.BASE_URL}/api/account/profile-picture/${filename}`;
  }

  /**
   * Check if a profile picture URL is accessible
   * @param {string} profilePictureUrl - The profile picture URL to check
   * @returns {Promise<boolean>} - True if accessible, false otherwise
   */
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

  /**
   * Create a fallback avatar element with user's initial
   * @param {string} username - User's username
   * @param {string} size - Size class ('small', 'medium', 'large')
   * @returns {string} - HTML string for fallback avatar
   */
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: bold;
      ">
        ${initial}
      </div>
    `;
  }

  /**
   * Create a complete profile picture element (img or fallback)
   * @param {string} profilePictureUrl - The profile picture URL from user data
   * @param {string} username - User's username for fallback
   * @param {string} size - Size class ('small', 'medium', 'large')
   * @param {string} additionalClasses - Additional CSS classes to apply
   * @returns {string} - HTML string for profile picture element
   */
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

  /**
   * Update an image element with profile picture or fallback
   * @param {HTMLImageElement} imgElement - The image element to update
   * @param {string} profilePictureUrl - The profile picture URL from user data
   * @param {string} username - User's username for fallback
   */
  async updateImageElement(imgElement, profilePictureUrl, username) {
    if (!imgElement) {
      console.warn(
        "ProfilePictureService.updateImageElement: No image element provided"
      );
      return;
    }

    // Remove any existing fallback avatars first
    const existingFallbacks =
      imgElement.parentNode.querySelectorAll(".fallback-avatar");
    existingFallbacks.forEach((fallback) => fallback.remove());

    const fullUrl = this.getProfilePictureUrl(profilePictureUrl);

    if (fullUrl) {
      try {
        // Try to fetch the image with authentication to bypass CORS issues
        const imageBlob = await this.fetchImageWithAuth(fullUrl);

        if (imageBlob) {
          // Create a local blob URL
          const blobUrl = URL.createObjectURL(imageBlob);

          // Clear any previous error handlers
          imgElement.onerror = null;
          imgElement.onload = () => {
            // Clean up the blob URL after the image loads
            URL.revokeObjectURL(blobUrl);
          };

          imgElement.src = blobUrl;
          imgElement.alt = `${username || "User"} Profile Picture`;
          imgElement.style.display = "block";

          console.log(
            "ProfilePictureService.updateImageElement: Successfully loaded profile picture"
          );
          return;
        }
      } catch (error) {
        console.warn(
          "Failed to fetch profile picture with auth, trying direct load:",
          error
        );

        // Fallback to direct image loading (might fail due to CORS)
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

    // No profile picture available or failed to load, show fallback
    this.showFallbackAvatar(imgElement, username);
  }

  /**
   * Fetch image with authentication headers to bypass CORS
   * @param {string} imageUrl - The image URL to fetch
   * @returns {Promise<Blob|null>} - The image blob or null if failed
   */
  async fetchImageWithAuth(imageUrl) {
    try {
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

      return await response.blob();
    } catch (error) {
      console.warn("Failed to fetch image with auth:", error);
      return null;
    }
  }

  /**
   * Show fallback avatar for an image element
   * @param {HTMLImageElement} imgElement - The image element
   * @param {string} username - Username for the fallback
   */
  showFallbackAvatar(imgElement, username) {
    imgElement.style.display = "none";
    imgElement.onerror = null;

    const fallbackHtml = this.createFallbackAvatar(username);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = fallbackHtml;
    const fallbackElement = tempDiv.firstElementChild;

    imgElement.parentNode.insertBefore(fallbackElement, imgElement);
    console.log("ProfilePictureService: Showing fallback avatar for", username);
  }

  /**
   * Update a container element with profile picture or fallback
   * @param {HTMLElement} containerElement - The container element to update
   * @param {string} profilePictureUrl - The profile picture URL from user data
   * @param {string} username - User's username for fallback
   * @param {string} size - Size class ('small', 'medium', 'large')
   */
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

  /**
   * Update a container element with profile picture using CORS-safe method
   * @param {HTMLElement} containerElement - The container element to update
   * @param {string} profilePictureUrl - The profile picture URL from user data
   * @param {string} username - User's username for fallback
   * @param {string} size - Size class ('small', 'medium', 'large')
   */
  async updateContainerElementSafe(
    containerElement,
    profilePictureUrl,
    username,
    size = "medium"
  ) {
    if (!containerElement) return;

    // Create initial structure with fallback
    const fallbackHtml = this.createFallbackAvatar(username, size);
    containerElement.innerHTML = fallbackHtml;

    // If there's a profile picture URL, try to load it
    if (profilePictureUrl) {
      try {
        const fullUrl = this.getProfilePictureUrl(profilePictureUrl);
        const imageBlob = await this.fetchImageWithAuth(fullUrl);

        if (imageBlob) {
          // Create image element with blob URL
          const img = document.createElement("img");
          const blobUrl = URL.createObjectURL(imageBlob);

          img.onload = () => {
            // Replace fallback with actual image
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
        // Keep the fallback that's already there
      }
    }
  }
}

export default new ProfilePictureService();
