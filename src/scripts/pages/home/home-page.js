import { HomePresenter } from "./home-page-presenter.js";
import { NavigationBar } from "../../components/NavigationBar.js";

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
          const navbar = new NavigationBar({
            currentPath: window.location.hash.slice(1),
            userInitial: state.user.initial,
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
                  <div class="card-home">
                    <div class="icon">
                      <img src="logo/Learning-Main.png" alt="Pembelajaran" class="card-icon" />
                    </div>
                    <div class="card-content">
                      <h3>Pembelajaran Interaktif</h3>
                      <p>Tersedia materi bertahap sesuai kategori Anda untuk memahami dunia pertanian dengan cara yang praktis dan menyenangkan.</p>
                    </div>
                    <button class="lihat-btn">Lihat</button>
                  </div>

                  <div class="card-home">
                    <img src="logo/Diagnose-Main.png" alt="Diagnosa" class="card-icon" />
                    <div class="card-content">
                      <h3>Diagnosa Tanaman</h3>
                      <p>Unggah foto, lalu biarkan AI membantu mengidentifikasi masalah dan memberi saran penanganan.</p>
                    </div>
                    <button>Lihat</button>
                  </div>

                  <div class="card-home">
                    <img src="logo/Comunity-Main.png" alt="Komunitas" class="card-icon" />
                    <div class="card-content">
                      <h3>Komunitas Tani</h3>
                      <p>Forum untuk bertanya, memberi saran, dan saling dukung antar petani, pelajar, maupun pegiat pertanian.</p>
                    </div>
                    <button>Lihat</button>
                  </div>

                  <div class="card-home">
                    <img src="logo/Ai-Main.png" alt="ai" class="card-icon" />
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
      console.log("HomePage render called");
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
      if (!localStorage.getItem("auth_token")) {
        localStorage.setItem("auth_token", "demo-token-" + Date.now());
        localStorage.setItem("user_name", "AgriEdu User");
      }

      const token = localStorage.getItem("auth_token");
      this.Model.setUserAuth(!!token);

      if (token) {
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

  async afterRender() {
    try {
      console.log("HomePage afterRender called");
      this.Presenter.bindEvents();

      const navbar = new NavigationBar({
        currentPath: window.location.hash.slice(1),
        userInitial: this.Model.state.user.initial,
        showProfile: true,
      });

      navbar.bindEvents();
    } catch (error) {
      console.error("Error in HomePage afterRender:", error);
    }
  }
}

export default HomePage;
