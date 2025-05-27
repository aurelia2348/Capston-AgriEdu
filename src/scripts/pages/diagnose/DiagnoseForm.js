import { NavigationBar } from "../../components/NavigationBar.js";
import DiagnosePresenter from "./DiagnosePage-Presenter.js";

export default class DiagnoseForm {
  constructor() {
    this.presenter = new DiagnosePresenter(this);
  }

  async render() {
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    return `
    <div class="Diagnosis-page-container">
      ${navbar.render()}
      <div id="typingAnimation" class="typing-animation"></div>
      
      <section class="container-form hidden-form">
        <h1>Diagnosis Tanaman</h1>
        <hr />
        <div class="form-preview-wrapper">
          <form id="diagnosis-form">
            <div>
              <label for="image">Unggah Gambar Tanaman</label>
              <div class="file-camera-wrapper">
                <div class="input-group">
                  <input type="file" id="image" name="image" accept="image/*" />
                  <button type="button" id="showCameraBtn" aria-label="Tampilkan kamera">
                    <i class="fas fa-camera"></i>
                  </button>
                </div>
              </div>
            </div>

            <div id="cameraSection" style="display: none;">
              <label for="cameraSelect">Pilih Kamera</label>
              <select id="cameraSelect"></select>
              <video id="cameraStream" autoplay playsinline></video>
              <canvas id="capturedCanvas" style="display:none;"></canvas>
              <button type="button" id="capturePhoto">Ambil Foto</button>
              <button type="button" id="retakePhoto" style="display: none;">Ambil Ulang Foto</button>
              <button type="button" id="stopCamera">Nonaktifkan Kamera</button>
            </div>

            <button type="submit">Analisis</button>
          </form>
          <div class="preview-result-box">
            <h2>Preview Gambar</h2>
            <img id="imagePreview" alt="Preview Gambar Tanaman" style="width: 100%; max-height: 100%; object-fit: contain;" />

            <h2>Hasil Analisis</h2>
            <div id="analysisResult" class="analysis-placeholder">
              Hasil analisis akan muncul di sini.
            </div>

            <button id="reanalyzeBtn" style="display: none; margin-top: 1rem;">Analisis Ulang</button>
          </div>
        </div>
      </section>
      <div class="floating-button-container">
  <button id="main-fab" class="fab">+</button>
  <div id="fab-menu" class="fab-menu hidden">
    <button id="go-community-btn" class="fab-menu-item">
      <img src="logo/community.png" alt="Community Icon" class="icon-scan" />
      go Ask to Community
    </button>
        <button id="go-chatbot-btn" class="fab-menu-item" onclick="location.href='#/chatbot'">
      <img src="logo/chatbot.png" alt="Chatbot Icon" class="icon-scan" />
      go Ask to Chatbot
    </button>
  </div>
</div>

    </div>
    `;
  }

  async afterRender() {
    this.setupNavigation();
    this.presenter.initCamera();
    this.presenter.initFormSubmit();

    function typeWriter(text, element, speed = 50) {
      return new Promise((resolve) => {
        let i = 0;
        function typing() {
          if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
          } else {
            setTimeout(resolve, 500);
          }
        }
        typing();
      });
    }

    async function runTypingAnimation() {
      const textElement = document.getElementById("typingAnimation");
      const formSection = document.querySelector(".container-form");

      const message = "Scan tanaman kamu sekarang dan temukan solusi dari masalahnya!";

      await typeWriter(message, textElement);

      textElement.style.transition = "opacity 0.5s ease";
      textElement.style.opacity = 0;

      setTimeout(() => {
        textElement.style.display = "none";
        formSection.classList.remove("hidden-form");
        formSection.classList.add("show-form");
      }, 500);
    }

    runTypingAnimation();

    const { photoInput, reanalyzeBtn } = this.getElements();
    const previewImage = document.getElementById("imagePreview");

    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          previewImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Event listener untuk tombol Analisis Ulang
    reanalyzeBtn.addEventListener("click", () => {
      this.resetFormAndAnalysis();
    });

    // FAB toggle
const fabBtn = document.getElementById("main-fab");
const fabMenu = document.getElementById("fab-menu");

fabBtn.addEventListener("click", () => {
  fabMenu.classList.toggle("hidden");
});

// Go to community
const goCommunityBtn = document.getElementById("go-community-btn");
goCommunityBtn.addEventListener("click", () => {
  window.location.href = "/#/community";
});

  }

  setupNavigation() {
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    navbar.bindEvents();
  }

  showMessage(message) {
    alert(message);
  }

  getElements() {
    return {
      form: document.getElementById("diagnosis-form"),
      photoInput: document.getElementById("image"),
      showCameraBtn: document.getElementById("showCameraBtn"),
      cameraSection: document.getElementById("cameraSection"),
      cameraSelect: document.getElementById("cameraSelect"),
      cameraStream: document.getElementById("cameraStream"),
      capturePhoto: document.getElementById("capturePhoto"),
      retakePhoto: document.getElementById("retakePhoto"),
      stopCamera: document.getElementById("stopCamera"),
      capturedCanvas: document.getElementById("capturedCanvas"),
      reanalyzeBtn: document.getElementById("reanalyzeBtn"),
    };
  }

  resetFormAndAnalysis() {
    const form = document.getElementById("diagnosis-form");
    const previewImage = document.getElementById("imagePreview");
    const analysisDiv = document.getElementById("analysisResult");
    const reanalyzeBtn = document.getElementById("reanalyzeBtn");

    form.reset();
    previewImage.src = "";
    analysisDiv.innerHTML = "Hasil analisis akan muncul di sini.";
    reanalyzeBtn.style.display = "none";

    // Jika menggunakan kamera, matikan juga kamera
    if (this.presenter && this.presenter.stopCamera) {
      this.presenter.stopCamera();
    }
  }
}
