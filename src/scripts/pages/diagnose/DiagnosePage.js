import { NavigationBar } from "../../components/NavigationBar.js";

export default class DiagnosePage {
  async render() {
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

return `
  <div class="diagnose-page-container">
    ${navbar.render()}
    <section class="diagnose-hero-carousel">
      <div class="carousel-container">
        <div class="carousel-slide">
          <img src="images/Galeri1.jpg" alt="Tanaman 1" />
          <img src="images/Galeri2.jpg" alt="Tanaman 2" />
          <img src="images/Galeri3.jpg" alt="Tanaman 3" />
          <img src="images/Galeri4.jpg" alt="Tanaman 4" />
          <img src="images/Galeri5.jpg" alt="Tanaman 5" />
          <img src="images/Galeri6.jpg" alt="Tanaman 6" />
        </div>

        <!-- Overlay untuk judul dan teks -->
        <div class="carousel-caption">
          <h2 id="carousel-title">Diagnosa Cepat</h2>
          <p id="carousel-desc">AI kami membantu mendeteksi penyakit tanaman secara instan!</p>
        </div>
      </div>
    </section>

    <!-- Tambahan fitur deteksi tanaman -->
    <section class="diagnose-feature">
      <div class="feature-intro">
        <h2>Cara Kerja Fitur Deteksi Tanaman</h2>
        <p>Kirim atau ambil gambar tanamanmu, dan biarkan AI kami mendeteksi gejala penyakit secara otomatis. Dapatkan hasil analisis cepat lengkap dengan saran perawatan untuk menjaga tanamanmu tetap sehat.</p>
      </div>

      <div class="feature-steps">
        <div class="step">
          <img src="images/diagnosis1.jpg" alt="Unggah Gambar" />
          <h3>Unggah atau Ambil Gambar</h3>
          <p>Gunakan kamera langsung atau unggah dari galeri untuk mulai proses diagnosis.</p>
        </div>
        <div class="step">
          <img src="images/diagnosis2.jpg"" alt="Deteksi AI" />
          <h3>Analisis Otomatis oleh AI</h3>
          <p>Gambar akan dianalisis oleh AI berbasis model pembelajaran penyakit tanaman.</p>
        </div>
        <div class="step">
          <img src="images/diagnosis3.jpg"" alt="Hasil Diagnosa" />
          <h3>Lihat Hasil & Saran</h3>
          <p>Hasil diagnosis akan muncul lengkap dengan nama penyakit dan saran perawatan awal.</p>
        </div>
    <div class="step">
  <img src="images/diagnosis4.jpg"" alt="Tips Pencegahan" />
  <h3>Pelajari Cara Mencegah Penyakit</h3>
  <p>Ketahui langkah-langkah mudah untuk mencegah penyakit tanaman dan menjaga tanaman tetap sehat.</p>
</div>

      </div>
      <hr/>
    </section>
      <section class="diagnose-info">
      <h1 class="diagnose-title">Diagnosis <span class="highlight-green">Tanaman</span></h1>
      <p class="diagnose-desc">Unggah foto dan lihat hasil analisa dari AI terkait tanaman Anda sekarang!</p>
      <button class="diagnose-button">Mulai Analisis</button>
    </section>
  </div>
    <footer class="home-footer">
              <p>&copy; 2025 AgriEdu. All rights reserved.</p>
            </footer>
`;
  }

  async afterRender() {
    this.setupNavigationEvents();
    this.setupCarousel();
  }

  setupNavigationEvents() {
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    navbar.bindEvents();
  }

setupCarousel() {
  const slides = document.querySelectorAll('.carousel-slide img');
  const title = document.getElementById('carousel-title');
  const desc = document.getElementById('carousel-desc');

const texts = [
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


  let currentIndex = 0;
  const totalSlides = slides.length;

  slides.forEach((slide, i) => {
    slide.style.opacity = i === 0 ? '1' : '0';
    slide.style.position = 'absolute';
    slide.style.top = '0';
    slide.style.left = '0';
    slide.style.width = '100%';
    slide.style.height = '100%';
    slide.style.objectFit = 'cover';
    slide.style.transition = 'opacity 1.5s ease-in-out';
  });

  const updateCaption = () => {
    title.textContent = texts[currentIndex].title;
    desc.textContent = texts[currentIndex].desc;
  };

  setInterval(() => {
    slides[currentIndex].style.opacity = '0';

    currentIndex = (currentIndex + 1) % totalSlides;

    slides[currentIndex].style.opacity = '1';
    updateCaption();
  }, 5000);

  updateCaption();
}


}
