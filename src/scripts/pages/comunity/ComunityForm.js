import authService from "../../data/auth-service";
import CONFIG from "../../config";
import ProfileModel from "../profile/profile-model.js";
import profilePictureService from "../../data/profile-picture-service.js";
import { NavigationBar } from "../../components/NavigationBar.js";

export default class CommunityForm {
  constructor() {
    this.presenter = null;
    this.updateCameraDevices = this.updateCameraDevices.bind(this);
  }

  async render() {
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

      <section class="community-banner">
        <div class="banner-content">
          <img src="logo/Comunity-Main.png" alt="Community Icon" class="banner-icon" />
          <div class="banner-text">
            <h2>Selamat datang di Komunitas AgriEdu!</h2>
            <p>Komunitas untuk saling berbagi solusi dan pengalaman bercocok tanam. Mulai berbagi pengalaman Anda.</p>
          </div>
        </div>
      </section>


      <div class="profile-container">
        <aside class="profile-sidebar">
          <div class="sidebar-avatar">
            <img src="images/avatar.jpg" alt="Avatar" class="avatar" id="sidebarAvatar"/>
            <p id="sidebarUsername">Username User</p>
            <p id="sidebarExperience">Experience Level</p>
            <button class="sidebar-button">Unggah diskusi</button>
          </div>
        </aside>

        <main>
          <section class="container-form">
            <h1>Form Diskusi</h1>
            <hr />
            <form id="create-post-form" enctype="multipart/form-data">
              <div>
                <label for="title">Judul:</label>
                <input type="text" id="title" name="title" required placeholder="Judul diskusi" />
              </div>
              <div>
                <label for="content">Konten:</label>
                <textarea id="content" name="content" required placeholder="Tulis deskripsi di sini"></textarea>
              </div>

              <div class="file-camera-wrapper">
                <label for="image">Gambar:</label>
                <div class="input-group">
                  <input type="file" id="image" name="image" accept="image/*" />
                  <button type="button" id="showCameraBtn" aria-label="Tampilkan kamera">
                    <i class="fas fa-camera"></i>
                  </button>
                </div>
              </div>

              <div id="cameraSection" style="display: none;">
                <label for="cameraSelect">Pilih Kamera</label>
                <select id="cameraSelect"></select>
                <video id="cameraStream" autoplay playsinline style="width: 100%; max-height: 100%;"></video>
                <button type="button" id="capturePhoto">Ambil Foto</button>
                <button type="button" id="retakePhoto" style="display: none;" aria-label="Ambil ulang foto">Ambil Ulang Foto</button>
                <button type="button" id="stopCamera" style="margin-left: 8px;">Nonaktifkan Kamera</button>
                <canvas id="capturedCanvas" style="display:none;"></canvas>
              </div>

              <button type="submit" style="z-index: 9999; position: relative;">Kirim diskusi</button>
            </form>
            <div id="post-result"></div>
          </section>
        </main>
      </div>

      <footer class="profile-footer">
        <p>&copy; 2025 AgriEdu. All rights reserved.</p>
      </footer>
    </div>
  `;
  }

  async afterRender() {
    this.setupForm();
    this.setupCamera();
    this.setupNavigationEvents();

    await this.loadUserInfo();
  }

  setupNavigationEvents() {}

  async loadUserInfo() {
    try {
      const token = authService.getToken();

      if (token) {
        const response = await fetch(`${CONFIG.BASE_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data?.data || data;
          const username = userData?.username || "Pengguna";

          document.getElementById("sidebarUsername").textContent = username;

          const sidebarAvatar = document.getElementById("sidebarAvatar");
          if (sidebarAvatar) {
            await profilePictureService.updateImageElement(
              sidebarAvatar,
              userData.profilePictureUrl,
              username
            );
          }
        } else {
          window.location.hash = "#/login";
          return;
        }
      } else {
        window.location.hash = "#/login";
        return;
      }
    } catch (err) {
      console.error("Gagal ambil user info:", err);
      window.location.hash = "#/login";
      return;
    }

    try {
      const profile = await ProfileModel.getUserProfile();
      const experienceLevel = profile.experience || "Belum diatur";

      document.getElementById("sidebarExperience").textContent =
        experienceLevel;
    } catch (profileError) {
      console.error(
        "Failed to get experience from ProfileModel:",
        profileError
      );
      document.getElementById("sidebarExperience").textContent =
        "Gagal ambil experience";
    }
  }

  setupForm() {
    const form = document.getElementById("create-post-form");
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!this.validateForm(form)) {
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Mengirim...";

      const formData = new FormData(form);

      const event = new CustomEvent("submit-post", {
        detail: formData,
      });

      document.dispatchEvent(event);
    });

    if (submitButton) {
      submitButton.addEventListener("click", () => {});
    }
  }

  validateForm(form) {
    const title = form.querySelector("#title").value.trim();
    const content = form.querySelector("#content").value.trim();
    const resultDiv = document.getElementById("post-result");

    resultDiv.innerHTML = "";

    if (!title) {
      this.showError("Judul diskusi harus diisi.");
      return false;
    }

    if (title.length < 3) {
      this.showError("Judul diskusi minimal 3 karakter.");
      return false;
    }

    if (!content) {
      this.showError("Konten diskusi harus diisi.");
      return false;
    }

    if (content.length < 10) {
      this.showError("Konten diskusi minimal 10 karakter.");
      return false;
    }

    const imageFile = form.querySelector("#image").files[0];
    if (imageFile) {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];

      if (imageFile.size > maxSize) {
        this.showError("Ukuran gambar maksimal 5MB.");
        return false;
      }

      if (!allowedTypes.includes(imageFile.type)) {
        this.showError("Format gambar harus JPEG, PNG, atau GIF.");
        return false;
      }
    }

    return true;
  }

  showError(message) {
    const resultDiv = document.getElementById("post-result");
    resultDiv.innerHTML = `<p style="color: red; margin-top: 10px;">${message}</p>`;

    const submitButton = document.querySelector(
      '#create-post-form button[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Kirim diskusi";
    }
  }

  resetForm() {
    const form = document.getElementById("create-post-form");
    if (form) {
      form.reset();

      const canvas = document.getElementById("capturedCanvas");
      const video = document.getElementById("cameraStream");
      const cameraSection = document.getElementById("cameraSection");
      const showCameraBtn = document.getElementById("showCameraBtn");

      if (canvas) canvas.style.display = "none";
      if (video) video.style.display = "none";
      if (cameraSection) cameraSection.style.display = "none";
      if (showCameraBtn) showCameraBtn.style.display = "inline-block";

      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach((track) => track.stop());
        this.cameraStream = null;
      }
    }

    const submitButton = document.querySelector(
      '#create-post-form button[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Kirim diskusi";
    }
  }

  updateCameraDevices(devices) {
    const select = document.getElementById("cameraSelect");
    if (!select) return;

    select.innerHTML = "";
    devices.forEach((device, i) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label || `Kamera ${i + 1}`;
      select.appendChild(option);
    });
  }

  setupCamera() {
    const showBtn = document.getElementById("showCameraBtn");
    const camSec = document.getElementById("cameraSection");
    const video = document.getElementById("cameraStream");
    const capBtn = document.getElementById("capturePhoto");
    const retakeBtn = document.getElementById("retakePhoto");
    const stopBtn = document.getElementById("stopCamera");
    const canvas = document.getElementById("capturedCanvas");
    const photoInput = document.getElementById("image");
    const select = document.getElementById("cameraSelect");

    this.cameraStream = null;
    let isCaptured = false;

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        this.updateCameraDevices(videoDevices);
      })
      .catch((err) => {});

    const stopStream = () => {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach((t) => t.stop());
        this.cameraStream = null;
        stopBtn.style.display = "none";
      }
    };

    stopBtn.addEventListener("click", () => {
      stopStream();
      camSec.style.display = "none";
      showBtn.style.display = "inline-block";

      retakeBtn.style.display = "none";
      capBtn.textContent = "Ambil Foto";
      isCaptured = false;
    });

    const startCamera = async () => {
      stopStream();
      try {
        const deviceId = select.value;
        this.cameraStream = await navigator.mediaDevices.getUserMedia({
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
        });
        video.srcObject = this.cameraStream;
        video.style.display = "block";
        canvas.style.display = "none";
        retakeBtn.style.display = "none";
        capBtn.style.display = "inline-block";
        capBtn.textContent = "Ambil Foto";
        stopBtn.style.display = "inline-block";
        isCaptured = false;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengakses Kamera",
          text: "Gagal mengakses kamera: " + err.message,
          confirmButtonText: "OK",
        });
      }
    };

    showBtn.addEventListener("click", () => {
      camSec.style.display = "block";
      showBtn.style.display = "none";
      startCamera();
    });

    select.addEventListener("change", startCamera);

    capBtn.addEventListener("click", () => {
      if (!isCaptured) {
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.display = "block";
        video.style.display = "none";

        stopStream();
        video.srcObject = null;

        canvas.toBlob((blob) => {
          const file = new File([blob], "captured-photo.png", {
            type: "image/png",
          });
          const dt = new DataTransfer();
          dt.items.add(file);
          photoInput.files = dt.files;
        }, "image/png");

        isCaptured = true;
        capBtn.style.display = "none";
        retakeBtn.style.display = "inline-block";
      }
    });

    retakeBtn.addEventListener("click", () => {
      startCamera();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopStream();
      } else if (!isCaptured && camSec.style.display === "block") {
        startCamera();
      }
    });

    window.addEventListener("beforeunload", stopStream);
  }

  destroy() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = null;
    }
    const videoElement = document.getElementById("cameraStream");
    videoElement.srcObject = null;
    videoElement.style.display = "none";
    const camSec = document.getElementById("cameraSection");
    if (camSec) camSec.style.display = "none";
  }
}
