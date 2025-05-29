export class NavigationBar {
  constructor(options = {}) {
    this.currentPath = options.currentPath || window.location.hash.slice(1);
    this.userInitial = options.userInitial || "A";
    this.username = options.username || "User";
    this.profilePictureUrl = options.profilePictureUrl || null;
    this.showProfile = options.showProfile !== false; // Default to true
    this.customNavItems = options.navItems || null;

    this.defaultNavItems = [
      { href: "#/home", text: "Home", className: "nav-link" },
      { href: "#/learning", text: "Learning", className: "nav-link" },
      { href: "#/community", text: "Community", className: "nav-link" },
      { href: "#/diagnosis", text: "Diagnosis", className: "nav-link" },
      { href: "#/chatbot", text: "AI Assistant", className: "nav-link" },
    ];
  }

  render() {
    const navItems = this.customNavItems || this.defaultNavItems;

    return `
      <header class="app-navbar">
        <div class="app-navbar-content">
          <a href="#/home" class="app-logo">
            <img src="logo/Main-Logo-Black.png" alt="AgriEdu" style="height: 52px; width: auto;">
          </a>
          <div class="app-menu-toggle" id="appMenuToggle">
            <i class="fas fa-bars"></i>
          </div>
          <nav class="app-nav" id="appNavMenu">
            ${navItems
              .map(
                (item) => `
              <a href="${item.href}" class="${item.className} ${
                  this.isActive(item.href) ? "active" : ""
                }">${item.text}</a>
            `
              )
              .join("")}
            ${this.showProfile ? this.renderMobileProfileSection() : ""}
          </nav>
          ${this.showProfile ? this.renderProfileSection() : ""}
        </div>
      </header>
    `;
  }

  renderProfileSection() {
    // Import profile picture service dynamically to avoid circular dependencies
    const profilePictureHtml = this.createProfileIcon();

    return `
      <div class="user-profile-container">
        <a href="#/logout" class="app-logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
        <div class="app-profile-icon-container" id="appProfileIconContainer">
          ${profilePictureHtml}
        </div>
      </div>
    `;
  }

  renderMobileProfileSection() {
    // Profile section for mobile menu
    const profilePictureHtml = this.createProfileIcon(true);

    return `
      <div class="mobile-only" style="display: flex; align-items: center; justify-content: flex-end; gap: 15px; padding: 15px 20px; border-top: 1px solid #e0e0e0; margin-top: 15px; background: #f8f9fa; margin-left: auto; margin-right: 0;">
        <a href="#/logout" class="app-logout" style="margin: 0; padding: 6px 12px; font-size: 13px;">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #333; font-weight: 500; font-size: 14px;">${this.username}</span>
          <div class="app-profile-icon-container" id="appMobileProfileIconContainer">
            ${profilePictureHtml}
          </div>
        </div>
      </div>
    `;
  }

  createProfileIcon(isMobile = false) {
    if (this.profilePictureUrl) {
      // Create profile picture with fallback - we'll load it after rendering
      const imgId = isMobile ? "navProfilePictureMobile" : "navProfilePicture";
      return `
        <img id="${imgId}"
             alt="${this.username} Profile Picture"
             class="app-profile-icon profile-picture"
             style="display: none;">
        <div class="app-profile-icon fallback-icon">${this.userInitial}</div>
      `;
    } else {
      // Use fallback initial
      return `<div class="app-profile-icon">${this.userInitial}</div>`;
    }
  }

  /**
   * Load profile picture after the navigation bar is rendered
   */
  async loadProfilePicture() {
    console.log(
      "NavigationBar loadProfilePicture called with URL:",
      this.profilePictureUrl
    );
    if (!this.profilePictureUrl) {
      console.log("No profile picture URL provided");
      return;
    }

    const imgElement = document.getElementById("navProfilePicture");
    const mobileImgElement = document.getElementById("navProfilePictureMobile");
    const fallbackElements = document.querySelectorAll(
      ".app-profile-icon.fallback-icon"
    );

    console.log(
      "Found elements - desktop:",
      !!imgElement,
      "mobile:",
      !!mobileImgElement,
      "fallbacks:",
      fallbackElements.length
    );

    if (!imgElement && !mobileImgElement) {
      console.log("No profile picture elements found in DOM");
      return;
    }

    try {
      // Import profile picture service dynamically
      const profilePictureService = (
        await import("../data/profile-picture-service.js")
      ).default;
      const fullUrl = profilePictureService.getProfilePictureUrl(
        this.profilePictureUrl
      );

      // Try to fetch the image with authentication
      const imageBlob = await profilePictureService.fetchImageWithAuth(fullUrl);

      if (imageBlob) {
        // Create a local blob URL
        const blobUrl = URL.createObjectURL(imageBlob);

        // Handle desktop profile picture
        if (imgElement) {
          imgElement.onload = () => {
            // Hide fallback and show image
            fallbackElements.forEach((fallback) => {
              if (fallback.closest("#appProfileIconContainer")) {
                fallback.style.display = "none";
              }
            });
            imgElement.style.display = "flex";
            // Clean up the blob URL after the image loads
            URL.revokeObjectURL(blobUrl);
          };

          imgElement.onerror = () => {
            URL.revokeObjectURL(blobUrl);
          };

          imgElement.src = blobUrl;
        }

        // Handle mobile profile picture
        if (mobileImgElement) {
          mobileImgElement.onload = () => {
            // Hide mobile fallback and show image
            fallbackElements.forEach((fallback) => {
              if (fallback.closest("#appMobileProfileIconContainer")) {
                fallback.style.display = "none";
              }
            });
            mobileImgElement.style.display = "flex";
          };

          mobileImgElement.onerror = () => {
            // Keep fallback visible
          };

          mobileImgElement.src = blobUrl;
        }
      }
    } catch (error) {
      console.warn("Failed to load navigation bar profile picture:", error);
    }
  }

  isActive(href) {
    const path = href.replace("#", "");
    return this.currentPath === path || this.currentPath === path.substring(1);
  }

  bindEvents() {
    this.setupMobileNavigation();
    this.setupProfileEvents();
    this.setupNavigationEvents();

    // Load profile picture after events are bound
    if (this.profilePictureUrl) {
      // Use a small delay to ensure DOM is fully rendered
      setTimeout(() => {
        this.loadProfilePicture();
      }, 100);
    }
  }

  setupMobileNavigation() {
    const menuToggle = document.querySelector("#appMenuToggle");
    const appNav = document.querySelector("#appNavMenu");

    if (menuToggle && appNav) {
      this.menuToggle = menuToggle;
      this.appNav = appNav;

      menuToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMobileMenu();
      });

      document.addEventListener("click", (e) => {
        if (!menuToggle.contains(e.target) && !appNav.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeMobileMenu();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          this.closeMobileMenu();
        }
      });
    }
  }

  setupProfileEvents() {
    // Handle both profile picture and fallback icon clicks
    const profileContainer = document.querySelector(
      ".app-profile-icon-container"
    );
    const mobileProfileContainer = document.querySelector(
      "#appMobileProfileIconContainer"
    );
    const profileIcons = document.querySelectorAll(".app-profile-icon");

    if (profileContainer) {
      profileContainer.addEventListener("click", () => {
        window.location.hash = "#/profile";
      });
    }

    if (mobileProfileContainer) {
      mobileProfileContainer.addEventListener("click", () => {
        window.location.hash = "#/profile";
        this.closeMobileMenu(); // Close mobile menu when navigating to profile
      });
    }

    // Fallback for individual icons if container doesn't exist
    profileIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        window.location.hash = "#/profile";
      });
    });
  }

  setupNavigationEvents() {
    const navLinks = document.querySelectorAll(".app-nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu();
        this.updateActiveLink(link.getAttribute("href"));
      });
    });
  }

  toggleMobileMenu() {
    if (this.appNav && this.menuToggle) {
      const isOpen = this.appNav.classList.contains("show");

      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }
  }

  openMobileMenu() {
    if (this.appNav && this.menuToggle) {
      this.appNav.classList.add("show");
      this.menuToggle.classList.add("active");

      const icon = this.menuToggle.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      }

      document.body.style.overflow = "hidden";
    }
  }

  closeMobileMenu() {
    if (this.appNav && this.menuToggle) {
      this.appNav.classList.remove("show");
      this.menuToggle.classList.remove("active");

      const icon = this.menuToggle.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }

      document.body.style.overflow = "";
    }
  }

  updateActiveLink(href) {
    const navLinks = document.querySelectorAll(".app-nav a");
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === href) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  updateUserInitial(initial) {
    this.userInitial = initial;
    const profileIcon = document.querySelector(".app-profile-icon");
    if (profileIcon) {
      profileIcon.textContent = initial;
    }
  }

  /**
   * Update the profile picture in the navigation bar
   * @param {string} profilePictureUrl - The new profile picture URL
   * @param {string} username - The username for fallback
   */
  updateProfilePicture(profilePictureUrl, username) {
    this.profilePictureUrl = profilePictureUrl;
    this.username = username || this.username;

    const profileContainer = document.querySelector(
      ".app-profile-icon-container"
    );
    const mobileProfileContainer = document.querySelector(
      "#appMobileProfileIconContainer"
    );

    if (profileContainer) {
      const newProfileHtml = this.createProfileIcon(false);
      profileContainer.innerHTML = newProfileHtml;
    }

    if (mobileProfileContainer) {
      const newProfileHtml = this.createProfileIcon(true);
      mobileProfileContainer.innerHTML = newProfileHtml;
    }

    // Re-bind events for the new elements
    this.setupProfileEvents();

    // Load the new profile picture
    if (this.profilePictureUrl) {
      this.loadProfilePicture();
    }
  }

  /**
   * Update user data in the navigation bar
   * @param {Object} userData - User data object
   * @param {string} userData.username - Username
   * @param {string} userData.profilePictureUrl - Profile picture URL
   */
  updateUserData(userData) {
    if (userData) {
      this.username = userData.username || this.username;
      this.userInitial = (userData.username || this.username)
        .charAt(0)
        .toUpperCase();
      this.updateProfilePicture(userData.profilePictureUrl, userData.username);
    }
  }

  static create(options = {}) {
    return new NavigationBar(options);
  }
}

export default NavigationBar;
