export class NavigationBar {
  constructor(options = {}) {
    this.currentPath = options.currentPath || window.location.hash.slice(1);
    this.userInitial = options.userInitial || "A";
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

  renderMobileProfileSection() {
    return `
      <div class="user-profile-container mobile-only">
        <a href="#/profile" class="app-profile-link">
          <i class="fas fa-user"></i> Profile
        </a>
        <a href="#/logout" class="app-logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    `;
  }

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

  isActive(href) {
    const path = href.replace("#", "");
    return this.currentPath === path || this.currentPath === path.substring(1);
  }

  bindEvents() {
    this.setupMobileNavigation();
    this.setupProfileEvents();
    this.setupNavigationEvents();
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
        if (window.innerWidth > 1155) {
          this.closeMobileMenu();
        }
      });
    }
  }

  setupProfileEvents() {
    const profileIcon = document.querySelector(".app-profile-icon");
    if (profileIcon) {
      profileIcon.addEventListener("click", () => {
        window.location.hash = "#/profile";
      });
    }
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

  static create(options = {}) {
    return new NavigationBar(options);
  }
}

export default NavigationBar;
