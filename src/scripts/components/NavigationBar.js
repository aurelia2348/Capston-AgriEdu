let navigationBarInstance = null;

export class NavigationBar {
  constructor(options = {}) {
    this.currentPath = options.currentPath || window.location.hash.slice(1);
    this.userInitial = options.userInitial || "A";
    this.username = options.username || "User";
    this.profilePictureUrl = options.profilePictureUrl || null;
    this.showProfile = options.showProfile !== false;
    this.customNavItems = options.navItems || null;

    this.profilePictureCache = new Map();
    this.currentProfileBlobUrl = null;

    this.defaultNavItems = [
      { href: "#/home", text: "Home", className: "nav-link" },
      { href: "#/learning", text: "Learning", className: "nav-link" },
      { href: "#/community", text: "Community", className: "nav-link" },
      { href: "#/diagnosis", text: "Diagnosis", className: "nav-link" },
      { href: "#/chatbot", text: "AI Assistant", className: "nav-link" },
    ];
  }

  static getInstance(options = {}) {
    if (!navigationBarInstance) {
      navigationBarInstance = new NavigationBar(options);
    } else {
      navigationBarInstance.updateOptions(options);
    }
    return navigationBarInstance;
  }

  updateOptions(options) {
    const oldPath = this.currentPath;
    this.currentPath = options.currentPath || window.location.hash.slice(1);
    this.userInitial = options.userInitial || this.userInitial;
    this.username = options.username || this.username;
    this.showProfile = options.showProfile !== false;
    this.customNavItems = options.navItems || this.customNavItems;

    if (options.profilePictureUrl !== this.profilePictureUrl) {
      this.profilePictureUrl = options.profilePictureUrl;
      this.updateProfilePictureIfNeeded();
    }

    if (oldPath !== this.currentPath) {
      this.updateActiveLinks();
    }
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
      const imgId = isMobile ? "navProfilePictureMobile" : "navProfilePicture";
      return `
        <img id="${imgId}"
             alt="${this.username} Profile Picture"
             class="app-profile-icon profile-picture"
             style="display: none;">
        <div class="app-profile-icon fallback-icon">${this.userInitial}</div>
      `;
    } else {
      return `<div class="app-profile-icon">${this.userInitial}</div>`;
    }
  }

  async loadProfilePicture() {
    if (!this.profilePictureUrl) {
      return;
    }

    const imgElement = document.getElementById("navProfilePicture");
    const mobileImgElement = document.getElementById("navProfilePictureMobile");
    const fallbackElements = document.querySelectorAll(
      ".app-profile-icon.fallback-icon"
    );

    if (!imgElement && !mobileImgElement) {
      return;
    }

    try {
      const profilePictureService = (
        await import("../data/profile-picture-service.js")
      ).default;
      const fullUrl = profilePictureService.getProfilePictureUrl(
        this.profilePictureUrl
      );

      const imageBlob = await profilePictureService.fetchImageWithAuth(fullUrl);

      if (imageBlob) {
        const blobUrl = URL.createObjectURL(imageBlob);

        if (imgElement) {
          imgElement.onload = () => {
            fallbackElements.forEach((fallback) => {
              if (fallback.closest("#appProfileIconContainer")) {
                fallback.style.display = "none";
              }
            });
            imgElement.style.display = "flex";
            URL.revokeObjectURL(blobUrl);
          };

          imgElement.onerror = () => {
            URL.revokeObjectURL(blobUrl);
          };

          imgElement.src = blobUrl;
        }

        if (mobileImgElement) {
          mobileImgElement.onload = () => {
            fallbackElements.forEach((fallback) => {
              if (fallback.closest("#appMobileProfileIconContainer")) {
                fallback.style.display = "none";
              }
            });
            mobileImgElement.style.display = "flex";
          };

          mobileImgElement.onerror = () => {};

          mobileImgElement.src = blobUrl;
        }
      }
    } catch (error) {
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

    if (this.profilePictureUrl) {
      this.loadProfilePicture();
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
        this.closeMobileMenu();
      });
    }

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

    this.setupProfileEvents();

    if (this.profilePictureUrl) {
      this.loadProfilePicture();
    }
  }

  async updateProfilePictureIfNeeded() {
    if (!this.profilePictureUrl) return;

    const cacheKey = this.profilePictureUrl;
    if (this.profilePictureCache.has(cacheKey)) {
      const cachedBlobUrl = this.profilePictureCache.get(cacheKey);
      this.applyProfilePicture(cachedBlobUrl);
      return;
    }

    await this.loadProfilePictureWithCache();
  }

  async loadProfilePictureWithCache() {
    if (!this.profilePictureUrl) return;

    const cacheKey = this.profilePictureUrl;

    if (this.profilePictureCache.has(cacheKey)) {
      const cachedBlobUrl = this.profilePictureCache.get(cacheKey);
      this.applyProfilePicture(cachedBlobUrl);
      return;
    }

    try {
      const profilePictureService = (
        await import("../data/profile-picture-service.js")
      ).default;
      const fullUrl = profilePictureService.getProfilePictureUrl(
        this.profilePictureUrl
      );

      const imageBlob = await profilePictureService.fetchImageWithAuth(fullUrl);

      if (imageBlob) {
        if (this.currentProfileBlobUrl) {
          URL.revokeObjectURL(this.currentProfileBlobUrl);
        }

        const blobUrl = URL.createObjectURL(imageBlob);
        this.currentProfileBlobUrl = blobUrl;

        this.profilePictureCache.set(cacheKey, blobUrl);

        this.applyProfilePicture(blobUrl);
      }
    } catch (error) {
    }
  }

  applyProfilePicture(blobUrl) {
    const imgElement = document.getElementById("navProfilePicture");
    const mobileImgElement = document.getElementById("navProfilePictureMobile");
    const fallbackElements = document.querySelectorAll(
      ".app-profile-icon.fallback-icon"
    );

    if (imgElement) {
      imgElement.onload = () => {
        fallbackElements.forEach((fallback) => {
          if (fallback.closest("#appProfileIconContainer")) {
            fallback.style.display = "none";
          }
        });
        imgElement.style.display = "flex";
      };

      imgElement.onerror = () => {};

      imgElement.src = blobUrl;
    }

    if (mobileImgElement) {
      mobileImgElement.onload = () => {
        fallbackElements.forEach((fallback) => {
          if (fallback.closest("#appMobileProfileIconContainer")) {
            fallback.style.display = "none";
          }
        });
        mobileImgElement.style.display = "flex";
      };

      mobileImgElement.onerror = () => {};

      mobileImgElement.src = blobUrl;
    }
  }

  updateActiveLinks() {
    const navLinks = document.querySelectorAll(".app-nav a");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (this.isActive(href)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

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
