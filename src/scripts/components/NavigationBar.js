/**
 * NavigationBar Component
 * Reusable navigation bar component for AgriEdu application
 * Provides consistent navigation across all authenticated pages
 */

export class NavigationBar {
  constructor(options = {}) {
    this.currentPath = options.currentPath || window.location.hash.slice(1);
    this.userInitial = options.userInitial || "A";
    this.showProfile = options.showProfile !== false; // Default to true
    this.customNavItems = options.navItems || null;

    // Default navigation items
    this.defaultNavItems = [
      { href: "#/home", text: "Home", className: "nav-link" },
      { href: "#/learning", text: "Learning", className: "nav-link" },
      { href: "#/community", text: "Community", className: "nav-link" },
      { href: "#/diagnosis", text: "Diagnosis", className: "nav-link" },
      { href: "#/chatbot", text: "AI Assistant", className: "nav-link" },
    ];
  }

  /**
   * Generate the navigation bar HTML
   * @returns {string} HTML string for the navigation bar
   */
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
          </nav>
          ${this.showProfile ? this.renderProfileSection() : ""}
        </div>
      </header>
    `;
  }

  /**
   * Render the profile section (logout button and profile icon)
   * @returns {string} HTML string for the profile section
   */
  renderProfileSection() {
    return `
      <div class="user-profile-container">
        <a href="#/logout" class="app-logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
        <div class="app-profile-icon">${this.userInitial}</div>
      </div>
    `;
  }

  /**
   * Check if a navigation item is active
   * @param {string} href - The href to check
   * @returns {boolean} True if the item is active
   */
  isActive(href) {
    const path = href.replace("#", "");
    return this.currentPath === path || this.currentPath === path.substring(1);
  }

  /**
   * Set up event listeners for the navigation bar
   * Should be called after the navigation is rendered to the DOM
   */
  bindEvents() {
    this.setupMobileNavigation();
    this.setupProfileEvents();
    this.setupNavigationEvents();
  }

  /**
   * Set up mobile navigation toggle functionality
   */
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

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!menuToggle.contains(e.target) && !appNav.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeMobileMenu();
        }
      });

      // Close menu on window resize
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          this.closeMobileMenu();
        }
      });
    }
  }

  /**
   * Set up profile icon click events
   */
  setupProfileEvents() {
    const profileIcon = document.querySelector(".app-profile-icon");
    if (profileIcon) {
      profileIcon.addEventListener("click", () => {
        // Navigate to profile page instead of showing alert
        window.location.hash = "#/profile";
      });
    }
  }

  /**
   * Set up navigation link events
   */
  setupNavigationEvents() {
    const navLinks = document.querySelectorAll(".app-nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu();
        this.updateActiveLink(link.getAttribute("href"));
      });
    });
  }

  /**
   * Toggle mobile menu visibility
   */
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

  /**
   * Open mobile menu
   */
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

  /**
   * Close mobile menu
   */
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

  /**
   * Update active navigation link
   * @param {string} href - The href of the active link
   */
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

  /**
   * Update user initial in profile icon
   * @param {string} initial - The user's initial
   */
  updateUserInitial(initial) {
    this.userInitial = initial;
    const profileIcon = document.querySelector(".app-profile-icon");
    if (profileIcon) {
      profileIcon.textContent = initial;
    }
  }

  /**
   * Static method to create and render navigation bar
   * @param {Object} options - Navigation options
   * @returns {NavigationBar} NavigationBar instance
   */
  static create(options = {}) {
    return new NavigationBar(options);
  }
}

export default NavigationBar;
