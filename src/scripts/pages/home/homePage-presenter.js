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
    // Use event delegation for better performance
    const mainContent = document.querySelector("#main-content");
    if (!mainContent) return;

    // Learning section navigation
    const learnBtn = mainContent.querySelector("#learnBtn");
    if (learnBtn) {
      learnBtn.addEventListener("click", () => {
        console.log("Navigating to learning page");
        window.location.hash = "#/learning";
      });
    }

    // Community button navigation
    const communityBtn = mainContent.querySelector("#communityBtn");
    if (communityBtn) {
      communityBtn.addEventListener("click", () => {
        console.log("Navigating to community page");
        window.location.hash = "#/community";
      });
    }

    // Card buttons navigation
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

    // Add responsive navigation for mobile
    const menuToggle = mainContent.querySelector("#menuToggle");
    const homeNav = mainContent.querySelector(".home-nav");

    if (menuToggle && homeNav) {
      menuToggle.addEventListener("click", () => {
        homeNav.classList.toggle("show");
      });
    }

    // Add navigation link handling
    const navLinks = mainContent.querySelectorAll(".home-nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Close mobile menu when a link is clicked
        if (homeNav && homeNav.classList.contains("show")) {
          homeNav.classList.remove("show");
        }
      });
    });

    // Add profile icon click handler
    const profileIcon = mainContent.querySelector(".home-profile-icon");
    if (profileIcon) {
      profileIcon.addEventListener("click", () => {
        // Show a simple alert with user info
        const userName = localStorage.getItem("user_name") || "User";
        alert(`Logged in as: ${userName}\nStatus: Active`);
      });
    }

    // Add accessibility improvements
    const cards = mainContent.querySelectorAll(".card");
    cards.forEach((card) => {
      const button = card.querySelector("button");
      if (button) {
        // Make the entire card clickable for better UX
        card.style.cursor = "pointer";
        card.addEventListener("click", (e) => {
          if (e.target !== button) {
            button.click();
          }
        });

        // Add keyboard accessibility
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
}
