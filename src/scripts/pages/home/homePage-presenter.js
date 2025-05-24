export class HomePresenter {
  constructor(Model, View) {
    this.Model = Model;
    this.View = View;
  }

  renderHome() {
    const html = this.View.render(this.Model.state);
    const container = document.querySelector("#main-content");
    if (container) {
      container.innerHTML = html;
      this.bindEvents();
    } else {
      console.error("Main content container not found");
    }
  }

  changeView(view) {
    this.Model.setView(view);
    this.renderHome();
  }

  bindEvents() {
    const mainContent = document.querySelector("#main-content");
    if (!mainContent) return;

    const learnBtn = mainContent.querySelector("#learnBtn");
    if (learnBtn) {
      learnBtn.addEventListener("click", () => {
        console.log("Navigating to learning page");
        window.location.hash = "#/learning";
      });
    }

    const communityBtn = mainContent.querySelector("#communityBtn");
    if (communityBtn) {
      communityBtn.addEventListener("click", () => {
        console.log("Navigating to community page");
        window.location.hash = "#/community";
      });
    }

    const cardButtons = mainContent.querySelectorAll(".card button");
    cardButtons.forEach((button) => {
      const card = button.closest(".card");
      if (!card) return;

      button.addEventListener("click", () => {
        if (card.id === "learnCard") {
          console.log("Navigating to learning page from card");
          window.location.hash = "#/learning";
        } else if (card.id === "diagnosisCard") {
          console.log("Navigating to diagnosis page from card");
          window.location.hash = "#/diagnosis";
        } else if (card.id === "communityCard") {
          console.log("Navigating to community page from card");
          window.location.hash = "#/community";
        } else if (card.id === "aiCard") {
          console.log("Navigating to chatbot page from card");
          window.location.hash = "#/chatbot";
        }
      });
    });

    this.setupMobileNavigation(mainContent);

    const navLinks = mainContent.querySelectorAll(".home-nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu();
      });
    });

    const profileIcon = mainContent.querySelector(".home-profile-icon");
    if (profileIcon) {
      profileIcon.addEventListener("click", () => {
        const userName = localStorage.getItem("user_name") || "User";
        alert(`Logged in as: ${userName}\nStatus: Active`);
      });
    }

    const cards = mainContent.querySelectorAll(".card");
    cards.forEach((card) => {
      const button = card.querySelector("button");
      if (button) {
        card.style.cursor = "pointer";
        card.addEventListener("click", (e) => {
          if (e.target !== button) {
            button.click();
          }
        });

        card.setAttribute("tabindex", "0");
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            button.click();
          }
        });
      }
    });
    this._setActiveNav = this._setActiveNav.bind(this);
    this._setActiveNav();
    window.addEventListener("hashchange", this._setActiveNav);
  }

  _setActiveNav() {
    const navLinks = document.querySelectorAll(".home-nav a");
    const currentHash = window.location.hash;

    navLinks.forEach((link) => {
      if (link.getAttribute("href") === currentHash) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  setupMobileNavigation(mainContent) {
    const menuToggle = mainContent.querySelector("#menuToggle");
    const homeNav = mainContent.querySelector(".home-nav");

    if (menuToggle && homeNav) {
      this.menuToggle = menuToggle;
      this.homeNav = homeNav;

      menuToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMobileMenu();
      });

      document.addEventListener("click", (e) => {
        if (!menuToggle.contains(e.target) && !homeNav.contains(e.target)) {
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

  toggleMobileMenu() {
    if (this.homeNav && this.menuToggle) {
      const isOpen = this.homeNav.classList.contains("show");

      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }
  }

  openMobileMenu() {
    if (this.homeNav && this.menuToggle) {
      this.homeNav.classList.add("show");
      this.menuToggle.classList.add("active");

      const icon = this.menuToggle.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      }

      document.body.style.overflow = "hidden";

      console.log("Mobile menu opened");
    }
  }

  closeMobileMenu() {
    if (this.homeNav && this.menuToggle) {
      this.homeNav.classList.remove("show");
      this.menuToggle.classList.remove("active");

      const icon = this.menuToggle.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }

      document.body.style.overflow = "";

      console.log("Mobile menu closed");
    }
  }
}
