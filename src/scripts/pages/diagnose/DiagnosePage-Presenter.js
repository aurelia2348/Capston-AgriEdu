export default class DiagnosePresenter {
  constructor(view) {
    this.view = view;
    this.cameraStream = null;
    this.isCaptured = false;
    this.texts = [
      {
        title: "Diagnosa Cepat dan Akurat",
        desc: "Gunakan teknologi AI kami untuk mendiagnosis penyakit tanaman hanya dari sebuah foto. Proses cepat, hasil akurat, dan saran penanganan langsung tersedia.",
      },
      {
        title: "Komunitas Petani Digital",
        desc: "Bergabunglah dalam komunitas petani online kami! Bertukar pengalaman, berbagi solusi, dan dapatkan dukungan dari sesama petani di seluruh Indonesia.",
      },
      {
        title: "Belajar Bertani Lebih Cerdas",
        desc: "Akses modul interaktif dan artikel edukatif tentang pertanian modern, mulai dari hidroponik, irigasi tetes, hingga manajemen hama ramah lingkungan.",
      },
      {
        title: "Manfaat Pupuk Organik",
        desc: "Tahukah kamu? Penggunaan pupuk organik secara rutin bisa meningkatkan kesuburan tanah, memperbaiki struktur tanah, dan mendukung ekosistem mikroba alami.",
      },
      {
        title: "Merawat Tanaman dengan Konsisten",
        desc: "Tanaman yang tumbuh sehat berasal dari perawatan harian yang konsisten—penyiraman tepat waktu, pemupukan seimbang, dan pencahayaan yang cukup.",
      },
      {
        title: "Waspadai Cuaca dan Serangan Hama",
        desc: "Perubahan cuaca ekstrem bisa memperbesar risiko serangan hama dan penyakit. Pantau prakiraan cuaca dan ikuti tips pencegahan hama dari ahli kami.",
      },
    ];
  }

  getUserInitial() {
    const userName = localStorage.getItem("user_name") || "User";
    return userName.charAt(0).toUpperCase();
  }

  startCarousel() {
    this.view.setupCarousel(this.texts);
  }

  bindNavbarEvents(currentPath, userInitial) {
    this.view.bindNavigationEvents(currentPath, userInitial);
  }

  initFormSubmit() {
    const { form } = this.view.getElements();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const image = formData.get("image");

      if (!image || image.size === 0) {
        this.view.showMessage("Gambar tanaman belum dipilih!");
        return;
      }

      console.log("Kirim gambar ke API (placeholder):", image);
      this.view.showMessage("Gambar berhasil dikirim untuk dianalisis!");
      // TODO: panggil API diagnosis di sini
    });
  }

  initCamera() {
    const el = this.view.getElements();

    el.showCameraBtn.addEventListener("click", () => {
      el.cameraSection.style.display = "block";
      el.showCameraBtn.style.display = "none";

      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter(d => d.kind === "videoinput");
          el.cameraSelect.innerHTML = "";
          videoDevices.forEach((device, i) => {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.textContent = device.label || `Kamera ${i + 1}`;
            el.cameraSelect.appendChild(option);
          });
          this.startCamera(el);
        })
        .catch((err) => console.warn("Gagal mendapatkan perangkat:", err));
    });

    el.cameraSelect.addEventListener("change", () => this.startCamera(el));

    el.stopCamera.addEventListener("click", () => {
      this.stopCamera(el);
      el.cameraSection.style.display = "none";
      el.showCameraBtn.style.display = "inline-block";
    });

   el.capturePhoto.addEventListener("click", () => {
  if (!this.isCaptured) {
    const ctx = el.capturedCanvas.getContext("2d");
    el.capturedCanvas.width = el.cameraStream.videoWidth;
    el.capturedCanvas.height = el.cameraStream.videoHeight;
    ctx.drawImage(el.cameraStream, 0, 0, el.capturedCanvas.width, el.capturedCanvas.height);

    el.capturedCanvas.toBlob((blob) => {
      const file = new File([blob], "captured.png", { type: "image/png" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      el.photoInput.files = dataTransfer.files;
    });

    this.stopCamera(el);

    el.capturedCanvas.style.display = "block";
    el.cameraStream.style.display = "none";
    el.capturePhoto.style.display = "none";
    el.retakePhoto.style.display = "inline-block";
    el.stopCamera.style.display = "none";
    this.isCaptured = true;
  }
});


el.retakePhoto.addEventListener("click", () => {
  this.startCamera(el);

  el.cameraStream.style.display = "block";
  el.capturedCanvas.style.display = "none";
  el.capturePhoto.style.display = "inline-block";
  el.retakePhoto.style.display = "none";
  this.isCaptured = false;
});


document.addEventListener("visibilitychange", () => {
  const el = this.view.getElements();

  if (document.visibilityState === "hidden") {
    if (this.cameraStream) {
      this.wasCameraOn = true;
      this.stopCamera(el);

      // Tutup UI kamera
      el.cameraSection.style.display = "none";
      el.showCameraBtn.style.display = "inline-block";
    }
  } else if (document.visibilityState === "visible") {
    if (this.wasCameraOn) {
      el.cameraSection.style.display = "block";
      el.showCameraBtn.style.display = "none";
      this.startCamera(el);
      this.wasCameraOn = false;
    }
  }
});


// Matikan kamera saat keluar dari halaman atau reload
window.addEventListener("popstate", () => {
  this.stopCamera(this.view.getElements());
});
window.addEventListener("beforeunload", () => {
  this.stopCamera(this.view.getElements());
});


  }

  async startCamera(el) {
    this.stopCamera(el);
    try {
      const deviceId = el.cameraSelect.value;
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      });

      el.cameraStream.srcObject = this.cameraStream;
      el.cameraStream.style.display = "block";
      el.capturedCanvas.style.display = "none";
      el.retakePhoto.style.display = "none";
      el.capturePhoto.style.display = "inline-block";
      el.stopCamera.style.display = "inline-block";
      this.isCaptured = false;
    } catch (err) {
      this.view.showMessage("Tidak bisa mengakses kamera: " + err.message);
    }
  }

  stopCamera(el) {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = null;
      el.cameraStream.srcObject = null;
    }
  }


}
