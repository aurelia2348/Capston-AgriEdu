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

    
    const cardButtons = mainContent.querySelectorAll(".card-home button");
    cardButtons.forEach((button) => {
      const card = button.closest(".card-home");
      if (!card) return;

      button.addEventListener("click", () => {
        const cardId = card.getAttribute("id");
        switch (cardId) {
          case "learnCard":
            console.log("Navigating to learning page from card");
            window.location.hash = "#/learning";
            break;
          case "diagnosisCard":
            console.log("Navigating to diagnosis page from card");
            window.location.hash = "#/diagnosis";
            break;
          case "communityCard":
            console.log("Navigating to community page from card");
            window.location.hash = "#/community";
            break;
          case "aiCard":
            console.log("Navigating to chatbot page from card");
            window.location.hash = "#/chatbot";
            break;
        }
      });
    });

    
    const cards = mainContent.querySelectorAll(".card-home");
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
    const navLinks = document.querySelectorAll(".app-nav a, .home-nav a");
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
