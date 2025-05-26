import { articles } from "./LearningPage-Model.js";
import {
  renderArticles,
  getFilteredArticles,
} from "./LearningPage-Presenter.js";
import { NavigationBar } from "../../components/NavigationBar.js";

export default class LearningPage {
  constructor() {}

  render() {
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    return `
      <div class="learning-page">
        ${navbar.render()}
        <div class="learning-content">
          <h2>Galeri <span class="highlight">Bertani</span></h2>

          <div class="gallery-carousel">
            <button class="gallery-carousel-nav gallery-carousel-left" id="gallery-prev">
              <i class="fa fa-chevron-left"></i>
            </button>
            <div class="gallery-carousel-track-wrapper">
              <div class="gallery-carousel-track" id="gallery-track">
                <div class="gallery-slide"><img src="/images/Galeri1.jpg" alt="gallery1" /></div>
                <div class="gallery-slide"><img src="/images/Galeri2.jpg" alt="gallery2" /></div>
                <div class="gallery-slide"><img src="/images/Galeri3.jpg" alt="gallery3" /></div>
                <div class="gallery-slide"><img src="/images/Galeri4.jpg" alt="gallery4" /></div>
                <div class="gallery-slide"><img src="/images/Galeri5.jpg" alt="gallery5" /></div>
                <div class="gallery-slide"><img src="/images/Galeri6.jpg" alt="gallery6" /></div>
              </div>
            </div>
            <button class="gallery-carousel-nav gallery-carousel-right" id="gallery-next">
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>

          <section class="learning-section">
            <h3>Mulai pembelajaran</h3>

            <div class="learning-main">
              <div class="article-panel">
                <div class="article-search">
                  <input type="text" id="search" placeholder="Cari Judul Materi" />
                  <i class="fa fa-search search-icon"></i>
                </div>
                <div id="article-grid" class="article-grid"></div>
              </div>

              <aside class="article-filter-panel">
                <h4><i class="fa fa-filter"></i> Filter Materi</h4>
                <div>
                  <strong>Pengalaman</strong>
                  <label><input type="checkbox" /> Pemula</label>
                  <label><input type="checkbox" /> Menengah</label>
                  <label><input type="checkbox" /> Lanjutan</label>
                </div>
                <div>
                  <strong>Jenis Tanaman</strong>
                  <label><input type="checkbox" /> Sayuran</label>
                  <label><input type="checkbox" /> Buah</label>
                  <label><input type="checkbox" /> Tanaman Hias</label>
                  <label><input type="checkbox" /> Lainnya</label>
                </div>
                <div>
                  <strong>Metode</strong>
                  <label><input type="checkbox" /> Konvensional</label>
                  <label><input type="checkbox" /> Hidroponik</label>
                  <label><input type="checkbox" /> Organik</label>
                  <label><input type="checkbox" /> Lainnya</label>
                </div>
                <hr />
                <p><i class="fa fa-heart"></i> Lihat Favorite</p>
              </aside>
            </div>

            <section class="recent-learning">
              <h3>Baru saja dipelajari</h3>
              <p><a href="#">Budidaya Tomat: Petunjuk, Persiapan, Pemupukan, Pemeliharaan</a></p>
              <div class="video-wrapper">
                <iframe src="https://www.youtube.com/embed/hY7m5jjJ9mM" allowfullscreen></iframe>
                <iframe src="https://www.youtube.com/embed/FTQbiNvZqaY" allowfullscreen></iframe>
              </div>
            </section>
          </section>
        </div>
        <footer class="page-footer">
          <p>&copy; 2025 AgriEdu. All rights reserved.</p>
        </footer>
      </div>
    `;
  }

  afterRender() {
    const container = document.getElementById("article-grid");
    renderArticles(container, articles);

    document.getElementById("search").addEventListener("input", (e) => {
      const value = e.target.value;
      const filtered = getFilteredArticles(value);
      renderArticles(container, filtered);
    });

    this.setupGalleryCarousel();
    this.setupNavigationEvents();
  }

  setupGalleryCarousel() {
    const track = document.getElementById("gallery-track");
    const prevButton = document.getElementById("gallery-prev");
    const nextButton = document.getElementById("gallery-next");
    const slides = track.querySelectorAll(".gallery-slide");

    if (!track || !prevButton || !nextButton || slides.length === 0) {
      console.error("Gallery carousel elements not found");
      return;
    }

    let currentIndex = 2;
    const totalSlides = slides.length;

    const updateGallery = () => {
      slides.forEach((slide, index) => {
        slide.classList.remove("active", "dimmed");

        const relativePosition = index - currentIndex;

        if (relativePosition === 0) {
          slide.classList.add("active");
        } else if (Math.abs(relativePosition) <= 2) {
          slide.classList.add("dimmed");
        }
      });

      const firstSlide = slides[0];
      const slideStyle = window.getComputedStyle(firstSlide);
      const slideWidth =
        firstSlide.offsetWidth +
        parseInt(slideStyle.marginLeft) +
        parseInt(slideStyle.marginRight);
      const containerWidth = track.parentElement.offsetWidth;
      const offset =
        -currentIndex * slideWidth + containerWidth / 2 - slideWidth / 2;
      track.style.transform = `translateX(${offset}px)`;
    };

    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateGallery();
    });

    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateGallery();
    });

    updateGallery();
    window.addEventListener("resize", updateGallery);
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
}
