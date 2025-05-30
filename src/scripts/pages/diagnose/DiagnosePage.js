import { NavigationBar } from "../../components/NavigationBar.js";
import DiagnosePresenter from "./DiagnosePage-Presenter.js";
import authService from "../../data/auth-service.js";

export default class DiagnosePage {
  constructor() {
    this.presenter = new DiagnosePresenter(this);
  }

  async render() {
    
    const userData = authService.getUserData();
    const userName =
      userData?.username || localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      username: userName,
      profilePictureUrl: userData?.profilePictureUrl,
      showProfile: true,
    });

    return `
    <div class="diagnose-page-container">
      ${navbar.render()}

      <section class="diagnose-hero-carousel" data-aos="fade-down">
        <div class="carousel-container">
          <div class="carousel-slide">
            <img src="images/Galeri1.jpg" alt="Tanaman 1" />
            <img src="images/Galeri2.jpg" alt="Tanaman 2" />
            <img src="images/Galeri3.jpg" alt="Tanaman 3" />
            <img src="images/Galeri4.jpg" alt="Tanaman 4" />
            <img src="images/Galeri5.jpg" alt="Tanaman 5" />
            <img src="images/Galeri6.jpg" alt="Tanaman 6" />
          </div>
          <div class="carousel-caption">
            <h2 id="carousel-title">Diagnosa Cepat</h2>
            <p id="carousel-desc">AI kami membantu mendeteksi penyakit tanaman secara instan!</p>
          </div>
        </div>
      </section>

<section class="diagnose-feature" data-aos="fade-up">
  <div class="white-container" data-aos="fade-up" data-aos-delay="150">
  <div class="feature-intro" data-aos="fade-up" data-aos-delay="100">
    <h2>Cara Kerja Fitur Deteksi Tanaman</h2>
    <p>Kirim atau ambil gambar tanamanmu, dan biarkan AI kami mendeteksi gejala penyakit secara otomatis. Dapatkan hasil analisis cepat lengkap dengan saran perawatan untuk menjaga tanamanmu tetap sehat.</p>
  </div>
    <div class="feature-steps">
      <div class="step" data-aos="zoom-in" data-aos-delay="100">
        <img src="logo/Kamera.png" alt="Unggah Gambar" />
        <h3>Unggah atau Ambil Gambar</h3>
        <p>Gunakan kamera langsung atau unggah dari galeri untuk mulai proses diagnosis.</p>
      </div>
      <div class="step" data-aos="zoom-in" data-aos-delay="200">
        <img src="logo/Ai.png" alt="Deteksi AI" />
        <h3>Analisis Otomatis oleh AI</h3>
        <p>Gambar akan dianalisis oleh AI berbasis model pembelajaran penyakit tanaman.</p>
      </div>
      <div class="step" data-aos="zoom-in" data-aos-delay="300">
        <img src="logo/feedback.png" alt="Hasil Diagnosa" />
        <h3>Lihat Hasil & Saran</h3>
        <p>Hasil diagnosis akan muncul lengkap dengan nama penyakit dan saran perawatan awal.</p>
      </div>
      <div class="step" data-aos="zoom-in" data-aos-delay="400">
        <img src="logo/Care.png" alt="Tips Pencegahan" />
        <h3>Pelajari Cara Mencegah Penyakit</h3>
        <p>Ketahui langkah-langkah mudah untuk mencegah penyakit tanaman dan menjaga tanaman tetap sehat.</p>
      </div>
    </div>
  </div>
  <hr/>
</section>


      <section class="diagnose-info" data-aos="fade-up" data-aos-delay="200">
        <h1 class="diagnose-title">Diagnosis <span class="highlight-green">Tanaman</span></h1>
        <p class="diagnose-desc">Unggah foto dan lihat hasil analisa dari AI terkait tanaman Anda sekarang!</p>
        <button class="diagnose-button">Mulai Analisis</button>
      </section>

      <div class="floating-button-container">
  <button id="main-fab" class="fab">+</button>
  <div id="fab-menu" class="fab-menu hidden">
    <button id="scan-now-btn" class="fab-menu-item">
  <img src="logo/scan.png" alt="Scan Icon" class="icon-scan" />
  scan now
</button>

    <button id="how-to-btn" class="fab-menu-item">❓ how to scan?</button>
    <div id="how-to-desc" class="fab-description hidden">
      <ul>
        <li>Klik scan now</li>
        <li>Pilih/ambil gambar tanaman</li>
        <li>Submit & tunggu hasilnya</li>
      </ul>
    </div>
  </div>
</div>

    </div>

    <footer class="home-footer">
      <p>&copy; 2025 AgriEdu. All rights reserved.</p>
    </footer>
  `;
  }

  async afterRender() {
    
    const userData = authService.getUserData();
    const userName =
      userData?.username || localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();
    const currentPath = window.location.hash.slice(1);

    this.presenter.bindNavbarEvents(currentPath, userInitial);
    this.presenter.startCarousel();

    const analyzeButton = document.querySelector(".diagnose-button");
    analyzeButton.addEventListener("click", () => {
      window.location.hash = "/diagnosisForm";
    });

    const mainFab = document.getElementById("main-fab");
    const fabMenu = document.getElementById("fab-menu");
    const howToDesc = document.getElementById("how-to-desc");
    const scanNowBtn = document.getElementById("scan-now-btn");
    const howToBtn = document.getElementById("how-to-btn");

    if (mainFab && fabMenu && howToDesc && scanNowBtn && howToBtn) {
      mainFab.addEventListener("click", () => {
        fabMenu.classList.toggle("hidden");
        howToDesc.classList.add("hidden");
      });

      scanNowBtn.addEventListener("click", () => {
        window.location.hash = "/diagnosisForm";
      });

      howToBtn.addEventListener("click", () => {
        howToDesc.classList.toggle("hidden");
      });
    }

    
    if (typeof AOS !== "undefined") {
      AOS.init({ duration: 800, once: true });
    }
  }

  bindNavigationEvents(currentPath, userInitial) {
   
    const userData = authService.getUserData();
    const userName =
      userData?.username || localStorage.getItem("user_name") || "User";

    const navbar = new NavigationBar({
      currentPath: currentPath,
      userInitial: userInitial,
      username: userName,
      profilePictureUrl: userData?.profilePictureUrl,
      showProfile: true,
    });

    navbar.bindEvents();
  }

  setupCarousel(texts) {
    const slides = document.querySelectorAll(".carousel-slide img");
    const title = document.getElementById("carousel-title");
    const desc = document.getElementById("carousel-desc");

    let currentIndex = 0;
    const totalSlides = slides.length;

    slides.forEach((slide, i) => {
      slide.style.opacity = i === 0 ? "1" : "0";
      slide.style.position = "absolute";
      slide.style.top = "0";
      slide.style.left = "0";
      slide.style.width = "100%";
      slide.style.height = "100%";
      slide.style.objectFit = "cover";
      slide.style.transition = "opacity 1.5s ease-in-out";
    });

    const updateCaption = () => {
      title.textContent = texts[currentIndex].title;
      desc.textContent = texts[currentIndex].desc;
    };

    setInterval(() => {
      slides[currentIndex].style.opacity = "0";
      currentIndex = (currentIndex + 1) % totalSlides;
      slides[currentIndex].style.opacity = "1";
      updateCaption();
    }, 5000);

    updateCaption();
  }
}
