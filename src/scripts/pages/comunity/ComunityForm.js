export default class CommunityForm {
  constructor() {
    this.presenter = null; 
    this.updateCameraDevices = this.updateCameraDevices.bind(this);
  }

async render(state) {
  return `
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
            <div class="home-profile-icon">${state?.user?.initial ?? 'U'}</div>
          </div>
        </div>
      </header>

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

              <button type="submit">Kirim diskusi</button>
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
  }

  setupForm() {
    const form = document.getElementById('create-post-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const event = new CustomEvent('submit-post', {
        detail: formData,
      });

      document.dispatchEvent(event);
    });
  }

  updateCameraDevices(devices) {
    const select = document.getElementById('cameraSelect');
    if (!select) return;

    select.innerHTML = '';
    devices.forEach((device, i) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label || `Kamera ${i + 1}`;
      select.appendChild(option);
    });
  }

  setupCamera() {
    const showBtn = document.getElementById('showCameraBtn');
    const camSec = document.getElementById('cameraSection');
    const video = document.getElementById('cameraStream');
    const capBtn = document.getElementById('capturePhoto');
    const retakeBtn = document.getElementById('retakePhoto');
    const stopBtn = document.getElementById('stopCamera');
    const canvas = document.getElementById('capturedCanvas');
    const photoInput = document.getElementById('image');
    const select = document.getElementById('cameraSelect');

    this.cameraStream = null;
    let isCaptured = false;

    // Enumerate devices awal
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        this.updateCameraDevices(videoDevices);
      })
      .catch(err => console.warn('Gagal enumerate devices:', err));

    const stopStream = () => {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(t => t.stop());
        this.cameraStream = null;
        stopBtn.style.display = 'none';
      }
    };

    stopBtn.addEventListener('click', () => {
      stopStream();
      camSec.style.display = 'none';
      showBtn.style.display = 'inline-block';

      retakeBtn.style.display = 'none';
      capBtn.textContent = 'Ambil Foto';
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
        video.style.display = 'block';
        canvas.style.display = 'none';
        retakeBtn.style.display = 'none';
        capBtn.style.display = 'inline-block';
        capBtn.textContent = 'Ambil Foto';
        stopBtn.style.display = 'inline-block';
        isCaptured = false;
      } catch (err) {
        alert('Gagal mengakses kamera: ' + err.message);
      }
    };

    showBtn.addEventListener('click', () => {
      camSec.style.display = 'block';
      showBtn.style.display = 'none';
      startCamera();
    });

    select.addEventListener('change', startCamera);

    capBtn.addEventListener('click', () => {
      if (!isCaptured) {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.display = 'block';
        video.style.display = 'none';

        stopStream();
        video.srcObject = null;

        canvas.toBlob(blob => {
          const file = new File([blob], 'captured-photo.png', { type: 'image/png' });
          const dt = new DataTransfer();
          dt.items.add(file);
          photoInput.files = dt.files;
        }, 'image/png');

        isCaptured = true;
        capBtn.style.display = 'none';
        retakeBtn.style.display = 'inline-block';
      }
    });

    retakeBtn.addEventListener('click', () => {
      startCamera();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopStream();
      } else if (!isCaptured && camSec.style.display === 'block') {
        startCamera();
      }
    });

    window.addEventListener('beforeunload', stopStream);
  }

  destroy() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    const videoElement = document.getElementById('cameraStream');
    videoElement.srcObject = null;
    videoElement.style.display = 'none';
    const camSec = document.getElementById('cameraSection');
    if (camSec) camSec.style.display = 'none';
  }

  

}
