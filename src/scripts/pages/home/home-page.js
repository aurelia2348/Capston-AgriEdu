import { HomePresenter } from "./homePage-presenter.js";

class HomePage {
  constructor() {
    this.Model = {
      state: {
        view: "home",
        user: {
          initial: "A", // Default initial for profile icon
          isAuthenticated: false, // Default authentication status
        },
      },
      setView: (view) => {
        this.Model.state.view = view;
      },
      setUserAuth: (status) => {
        this.Model.state.user.isAuthenticated = status;
      },
    };

    this.View = {
      render: (state) => {
        return this.View.templates[state.view](state);
      },
      templates: {
        home: (state) => `
          <div class="home-container">
            <header class="home-navbar">
              <div class="home-navbar-content">
                <a href="#/home" class="home-logo">
                  <img src="logo/Main-Logo-Black.png" alt="AgriEdu" style="height: 52px; width: auto;">
                </a>
                <div class="home-menu-toggle" id="menuToggle">
                  <i class="fas fa-bars"></i>
                </div>
                <nav class="home-nav">
                  <a href="#/home" class="nav-link">Home</a>
                  <a href="#/learning" class="nav-link">Learning</a>
                  <a href="#/community" class="nav-link">Community</a>
                  <a href="#/diagnosis" class="nav-link">Diagnosis</a>
                  <a href="#/chatbot" class="nav-link">AI Assistant</a>
                </nav>
                <div class="user-profile-container">
                  <a href="#/logout" class="home-logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                  </a>
                  <div class="home-profile-icon">${state.user.initial}</div>
                </div>
              </div>
            </header>

            <main>
              <section class="hero">
                <h1>Selamat datang di <span class="green">AgriEdu</span>!</h1>
                <p>Belajar, berbagi, dan diagnosa tanaman dengan teknologi AI. Semoga pengalaman Anda menyenangkan!</p>
                <div class="hero-buttons">
                  <button class="green" id="learnBtn">Mulai Belajar</button>
                  <button class="white" id="communityBtn">Gabung Komunitas</button>
                </div>
              </section>

              <section class="main-activities">
                <h2>Aktivitas Utama</h2>
                <div class="grid-container">
                  <div class="card" id="learnCard">
                    <h3>Pembelajaran Interaktif</h3>
                    <p>Tersedia materi bertahap sesuai kategori Anda untuk memahami dunia pertanian dengan cara yang praktis dan menyenangkan.</p>
                    <button>Mulai Belajar</button>
                  </div>
                  <div class="card" id="diagnosisCard">
                    <h3>Diagnosa Tanaman</h3>
                    <p>Unggah foto, lalu biarkan AI membantu mengidentifikasi masalah dan memberi saran penanganan.</p>
                    <button>Mulai Diagnosa</button>
                  </div>
                  <div class="card" id="communityCard">
                    <h3>Komunitas Tani</h3>
                    <p>Forum untuk bertanya, memberi saran, dan saling dukung antara petani, pelajar, maupun pegiat pertanian.</p>
                    <button>Gabung Komunitas</button>
                  </div>
                  <div class="card" id="aiCard">
                    <h3>Asisten AI & ChatBot</h3>
                    <p>Chatbot cerdas yang siap bantu menjawab pertanyaan tentang tanaman, pembelajaran, dan fitur aplikasi.</p>
                    <button>Mulai Chat</button>
                  </div>
                </div>
              </section>
            </main>

            <footer class="home-footer">
              <p>&copy; 2025 AgriEdu. All rights reserved.</p>
            </footer>
          </div>
        `,
      },
    };

    this.Presenter = new HomePresenter(this.Model, this.View);
  }

  // Method to be called by the router
  async render() {
    try {
      console.log("HomePage render called");
      // Check authentication status
      this.checkAuthStatus();
      const html = this.View.render(this.Model.state);
      return html;
    } catch (error) {
      console.error("Error in HomePage render:", error);
      return `<div class="error-container">
        <h2>Error Loading Home Page</h2>
        <p>${error.message}</p>
      </div>`;
    }
  }

  // Check if user is authenticated
  checkAuthStatus() {
    try {
      // For demo purposes, we'll set the user as authenticated by default
      // In a real app, you would check for a valid token from your auth service

      // Set demo user data in localStorage if not already set
      if (!localStorage.getItem("auth_token")) {
        localStorage.setItem("auth_token", "demo-token-" + Date.now());
        localStorage.setItem("user_name", "AgriEdu User");
      }

      const token = localStorage.getItem("auth_token");
      this.Model.setUserAuth(!!token);

      if (token) {
        // Get user info from localStorage
        const userName = localStorage.getItem("user_name") || "User";
        this.Model.state.user.initial = userName.charAt(0).toUpperCase();
        console.log("User is authenticated:", userName);
      } else {
        console.log("User is not authenticated");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  }

  // Set up event listeners after rendering
  async afterRender() {
    try {
      console.log("HomePage afterRender called");
      this.Presenter.bindEvents();

      // Add mobile menu toggle functionality
      const menuToggle = document.getElementById("menuToggle");
      const homeNav = document.querySelector(".home-nav");

      if (menuToggle && homeNav) {
        menuToggle.addEventListener("click", () => {
          homeNav.classList.toggle("show");
        });
      }
    } catch (error) {
      console.error("Error in HomePage afterRender:", error);
    }
  }
}

export default HomePage;
