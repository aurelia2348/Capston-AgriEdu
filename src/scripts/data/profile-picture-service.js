import CONFIG from "../config.js";
import authService from "./auth-service.js";

class ProfilePictureService {
  /**
   * Upload a profile picture to the API
   * @param {File} file 
   * @returns {Promise<Object>} 
   */
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

  /**
   * Delete the current user's profile picture
   * @returns {Promise<Object>} 
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
   * @param {string} filename 
   * @returns {Promise<Blob>} 
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
   * @param {string} profilePictureUrl 
   * @returns {string|null} 
   */
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

  /**
   * Check if a profile picture URL is accessible
   * @param {string} profilePictureUrl 
   * @returns {Promise<boolean>} 
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
   * @param {string} username 
   * @param {string} size 
   * @returns {string} 
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
   * @param {string} profilePictureUrl 
   * @param {string} username 
   * @param {string} size 
   * @param {string} additionalClasses 
   * @returns {string} 
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
   * @param {HTMLImageElement} imgElement 
   * @param {string} profilePictureUrl 
   * @param {string} username 
   */
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

  /**
   * Fetch image with authentication headers to bypass CORS
   * @param {string} imageUrl 
   * @returns {Promise<Blob|null>} 
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
   * @param {HTMLImageElement} imgElement 
   * @param {string} username 
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
   * @param {HTMLElement} containerElement 
   * @param {string} profilePictureUrl 
   * @param {string} username 
   * @param {string} size 
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
   * @param {HTMLElement} containerElement 
   * @param {string} profilePictureUrl 
   * @param {string} username 
   * @param {string} size 
   */
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
