import { HomePresenter } from "./home-page-presenter.js";
import { NavigationBar } from "../../components/NavigationBar.js";
import authService from "../../data/auth-service.js";

class HomePage {
  constructor() {
    this.Model = {
      state: {
        view: "home",
        user: {
          initial: "A",
          isAuthenticated: false,
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
        home: (state) => {
          const userData = authService.getUserData();
          const userName =
            userData?.username || localStorage.getItem("user_name") || "User";
          const userInitial = userName.charAt(0).toUpperCase();

          const navbar = NavigationBar.getInstance({
            currentPath: window.location.hash.slice(1),
            userInitial: userInitial,
            username: userName,
            profilePictureUrl: userData?.profilePictureUrl,
            showProfile: true,
          });

          return `
          <div class="home-container">
            ${navbar.render()}

            <main>
              <section class="hero">
                <div class="hero-content">
                  <h1>Selamat datang di AgriE<span class="green">d</span>u!</h1>
                  <p>Belajar, berbagi, dan diagnosa tanaman dengan teknologi AI.</p>
                  <p>Semoga pengalaman Anda menyenangkan!</p>
                  <div class="hero-buttons">
                    <button class="green" id="learnBtn">Mulai Belajar</button>
                    <button class="white" id="communityBtn">Gabung Komunitas</button>
                  </div>
                </div>
              </section>

              <section class="main-activities">
                <div class="section-header">
                  <div class="logo-circle">
                    <img src="logo/Home-Activity.png" alt="Aktivitas Icon" class="header-icon">
                  </div>
                  <h2>Aktivitas Utama</h2>
                </div>

                <hr>
                <div class="grid-container-home">
                  <div class="card-home" id="learnCard">
                      <img src="logo/Learning-Main.png" alt="Pembelajaran" class="card-icon" />
                    <div class="card-content">
                      <h3>Pembelajaran Interaktif</h3>
                      <p>Tersedia materi bertahap sesuai kategori Anda untuk memahami dunia pertanian dengan cara yang praktis dan menyenangkan.</p>
                    </div>
                    <button class="lihat-btn">Lihat</button>
                  </div>

                  <div class="card-home" id="diagnosisCard">
                    <img src="logo/Diagnose-Main.png" alt="Diagnosa" class="card-icon" />
                    <div class="card-content">
                      <h3>Diagnosa Tanaman</h3>
                      <p>Unggah foto, lalu biarkan AI membantu mengidentifikasi masalah dan memberi saran penanganan.</p>
                    </div>
                    <button>Lihat</button>
                  </div>

                  <div class="card-home" id="communityCard">
                    <img src="logo/comunityhome.png" alt="Komunitas" class="card-icon" />
                    <div class="card-content">
                      <h3>Komunitas Tani</h3>
                      <p>Forum untuk bertanya, memberi saran, dan saling dukung antar petani, pelajar, maupun pegiat pertanian.</p>
                    </div>
                    <button>Lihat</button>
                  </div>

                  <div class="card-home" id="aiCard">
                    <img src="logo/Ai.png" alt="ai" class="card-icon" />
                    <div class="card-content">
                      <h3>Asisten AI & ChatBot</h3>
                      <p>Chatbot cerdas yang siap bantu menjawab pertanyaan tentang tanaman, pembelajaran, dan fitur aplikasi.</p>
                    </div>
                    <button>Lihat</button>
                  </div>
                </div>
              </section>
            </main>

            <footer class="home-footer">
              <p>&copy; 2025 AgriEdu. All rights reserved.</p>
            </footer>
          </div>
        `;
        },
      },
    };

    this.Presenter = new HomePresenter(this.Model, this.View);
  }

  async render() {
    try {
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

  checkAuthStatus() {
    try {
      const authToken = localStorage.getItem("agriedu_auth_token");
      const fallbackToken = localStorage.getItem("auth_token");

      if (!authToken && !fallbackToken) {
        localStorage.setItem("agriedu_auth_token", "demo-token-" + Date.now());
        localStorage.setItem("user_name", "AgriEdu User");
      }

      const token = authToken || fallbackToken;
      this.Model.setUserAuth(!!token);

      if (token) {
        const userName = localStorage.getItem("user_name") || "User";
        this.Model.state.user.initial = userName.charAt(0).toUpperCase();
      } else {
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  }

  async afterRender() {
    try {
      this.Presenter.bindEvents();

      const hashParts = window.location.hash.split("?");
      if (hashParts.length > 1) {
        const urlParams = new URLSearchParams(hashParts[1]);
        if (urlParams.get("welcome") === "true") {
          const userName = localStorage.getItem("user_name") || "User";
          Swal.fire({
            icon: "success",
            title: `Selamat datang, ${userName}!`,
            text: "Setup berhasil diselesaikan! Selamat menjelajahi fitur-fitur AgriEdu.",
            showConfirmButton: false,
            timer: 4000,
          });

          window.history.replaceState(null, null, "#/home");
        }
      }
    } catch (error) {
      console.error("Error in HomePage afterRender:", error);
    }
  }
}

export default HomePage;
