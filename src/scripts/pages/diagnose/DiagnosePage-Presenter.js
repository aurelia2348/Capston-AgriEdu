import plantDiseaseService from '../../data/plant-disease-service.js';
import plantDiseaseModel from '../../../models/plant_disease/model-loader.js';

// Debug function to check model loading
async function debugModelLoading() {
  try {
    const modelExists = await plantDiseaseModel.checkModelExists();
    
    if (modelExists) {
      const loaded = await plantDiseaseModel.loadModel();
      return loaded;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

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

  async initFormSubmit() {
    const { form } = this.view.getElements();

    // Inisialisasi model saat halaman dimuat
    try {
      // Debug model loading
      await debugModelLoading();
      
      // Try to initialize the model
      await plantDiseaseService.initModel();
      
      if (plantDiseaseService.isModelLoaded) {
        // Model loaded successfully
      } else {
        // Tampilkan pesan di UI
        const analysisResult = document.getElementById("analysisResult");
        if (analysisResult) {
          analysisResult.innerHTML = `
            <div class="error-message">
              <p>Model klasifikasi penyakit tanaman belum tersedia.</p>
              <p>Pastikan file model telah ditempatkan di folder yang benar:</p>
              <code>dist/models/plant_disease/model/model.json</code>
            </div>
          `;
        }
      }
    } catch (error) {
      // Error initializing model
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const image = formData.get("image");

      if (!image || image.size === 0) {
        this.view.showMessage("Gambar tanaman belum dipilih!");
        return;
      }

      // Tampilkan loading
      const analysisResult = document.getElementById("analysisResult");
      analysisResult.innerHTML = '<div class="loading-spinner"></div><p>Sedang menganalisis gambar...</p>';

      try {
        // Periksa apakah model sudah tersedia
        if (!plantDiseaseService.isModelLoaded) {
          const modelExists = await plantDiseaseModel.checkModelExists();
          if (!modelExists) {
            analysisResult.innerHTML = `
              <div class="error-message">
                <p><strong>Model tidak ditemukan!</strong></p>
                <p>Untuk menggunakan fitur diagnosa penyakit tanaman, Anda perlu menambahkan file model TensorFlow.js:</p>
                <ol>
                  <li>Pastikan file model (model.json dan file shard) sudah ditempatkan di folder <code>dist/models/plant_disease/model/</code></li>
                  <li>Jika folder belum ada, buat folder tersebut terlebih dahulu</li>
                  <li>Refresh halaman setelah menambahkan file model</li>
                </ol>
                <p>Atau hubungi administrator untuk bantuan lebih lanjut.</p>
              </div>
            `;
            return;
          }
          await plantDiseaseService.initModel();
        }
        
        // Lakukan diagnosa menggunakan model
        const result = await plantDiseaseService.diagnosePlant(image);
        
        // Tampilkan hasil diagnosa
        this.displayAnalysisResult(result);
        
        // Tampilkan tombol analisis ulang
        const reanalyzeBtn = document.getElementById("reanalyzeBtn");
        if (reanalyzeBtn) {
          reanalyzeBtn.style.display = "block";
        }
      } catch (error) {
        analysisResult.innerHTML = `
          <div class="error-message">
            <p><strong>Gagal menganalisis gambar:</strong> ${error.message}</p>
            <p>Kemungkinan penyebab:</p>
            <ul>
              <li>Model belum dimuat dengan benar</li>
              <li>Format gambar tidak didukung</li>
              <li>Ukuran gambar terlalu besar</li>
            </ul>
            <p>Coba gunakan gambar dengan format JPG atau PNG dengan ukuran yang lebih kecil.</p>
          </div>
        `;
        this.view.showMessage("Gagal menganalisis gambar!");
      }
    });
  }

  initCamera() {
    const el = this.view.getElements();

    el.showCameraBtn.addEventListener("click", () => {
      el.cameraSection.style.display = "block";
      el.showCameraBtn.style.display = "none";

      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === "videoinput");
          el.cameraSelect.innerHTML = "";
          videoDevices.forEach((device, i) => {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.textContent = device.label || `Kamera ${i + 1}`;
            el.cameraSelect.appendChild(option);
          });
          this.startCamera(el);
        })
        .catch((err) => {});
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
    ctx.drawImage(
      el.cameraStream,
      0,
      0,
      el.capturedCanvas.width,
      el.capturedCanvas.height
    );

    const previewImage = document.getElementById("imagePreview");
    previewImage.src = el.capturedCanvas.toDataURL("image/png");

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

  /**
   * Menampilkan hasil analisis penyakit tanaman
   * @param {Object} result - Hasil analisis dari model
   */
  displayAnalysisResult(result) {
    const analysisResult = document.getElementById("analysisResult");
    
    // Format persentase confidence
    const confidence = (result.confidence * 100).toFixed(2);
    
    // Buat HTML untuk hasil analisis
    const resultHTML = `
      <div class="diagnosis-result">
        <h3>Hasil Diagnosis:</h3>
        <div class="diagnosis-main">
          <p class="diagnosis-name">${result.className}</p>
          <p class="diagnosis-detail">${result.originalClassName || ''}</p>
          <p class="diagnosis-confidence">Tingkat keyakinan: ${confidence}%</p>
        </div>
        
        <div class="diagnosis-info">
          <h4>Deskripsi:</h4>
          <p>${result.diseaseInfo.description}</p>
          
          <h4>Penanganan:</h4>
          <p>${result.diseaseInfo.treatment}</p>
          
          <h4>Pencegahan:</h4>
          <p>${result.diseaseInfo.prevention}</p>
        </div>
        
        <div class="other-predictions">
          <h4>Kategori Penyakit Lainnya:</h4>
          <ul>
            ${result.groupedPredictions ? 
              result.groupedPredictions.slice(1, 4).map(pred => 
                `<li>${pred.className}: ${(pred.confidence * 100).toFixed(2)}%</li>`
              ).join('') : 
              result.allPredictions.slice(1, 3).map(pred => 
                `<li>${pred.className}: ${(pred.confidence * 100).toFixed(2)}%</li>`
              ).join('')
            }
          </ul>
        </div>
      </div>
    `;
    
    analysisResult.innerHTML = resultHTML;
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    const { form, imagePreview, diagnosisResult, loadingIndicator } = this.view.getElements();
    const fileInput = form.querySelector('#imageInput');
    const file = fileInput.files[0];

    if (!file) {
      alert('Pilih gambar terlebih dahulu');
      return;
    }

    try {
      // Tampilkan loading
      loadingIndicator.style.display = 'block';
      diagnosisResult.style.display = 'none';

      // Lakukan diagnosa
      const result = await plantDiseaseService.diagnosePlant(file);

      // Format persentase
      const confidencePercent = (result.confidence * 100).toFixed(2);
      
      // Tampilkan hasil
      diagnosisResult.innerHTML = `
        <h2>Hasil Analisis</h2>
        ${plantDiseaseService.simulationMode ? '<div class="simulation-notice">Catatan: Hasil ini adalah simulasi karena model AI belum tersedia.</div>' : ''}
        ${plantDiseaseService.simulationMode ? '<div class="simulation-notice">Untuk hasil yang akurat, pastikan file model telah ditempatkan dengan benar.</div>' : ''}
        
        <h3>Hasil Diagnosis:</h3>
        <div class="diagnosis-result">${result.className}</div>
        
        <div class="original-class">${result.originalClassName}</div>
        
        <p>Tingkat keyakinan: ${confidencePercent}%</p>
        
        <h3>Deskripsi:</h3>
        <p>${result.diseaseInfo.description}</p>
        
        <h3>Penanganan:</h3>
        <p>${result.diseaseInfo.treatment}</p>
        
        <h3>Pencegahan:</h3>
        <p>${result.diseaseInfo.prevention}</p>
        
        <h3>Kategori Penyakit Lainnya:</h3>
        <ul class="other-diseases">
          ${result.groupedPredictions.slice(1, 4).map(pred => 
            `<li>${pred.className}: ${(pred.confidence * 100).toFixed(2)}%</li>`
          ).join('')}
        </ul>
      `;
      
      // Tampilkan hasil
      diagnosisResult.style.display = 'block';
    } catch (error) {
      console.error('Error:', error);
      diagnosisResult.innerHTML = `
        <div class="error-message">
          <p>Terjadi kesalahan saat memproses gambar.</p>
          <p>Detail: ${error.message}</p>
        </div>
      `;
      diagnosisResult.style.display = 'block';
    } finally {
      // Sembunyikan loading
      loadingIndicator.style.display = 'none';
    }
  }
}
