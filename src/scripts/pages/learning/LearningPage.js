import { articles } from "./LearningPage-Model.js";
import {
  renderArticles,
  getFilteredArticles,
} from "./LearningPage-Presenter.js";
import { NavigationBar } from "../../components/NavigationBar.js";

export default class LearningPage {
  constructor() {}

  render() {
    // Get user initial from localStorage
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    return `
      <div class="learning-page-container">
        ${navbar.render()}
        <div class="learning-container">
        <h2>Galeri <span class="highlight">Bertani</span></h2>
        <div class="carousel-container">
          <button class="carousel-nav carousel-nav-left" id="carousel-prev">
            <i class="fa fa-chevron-left"></i>
          </button>
          <div class="carousel-wrapper">
            <div class="carousel-track" id="carousel-track">
              <div class="carousel-item">
                <img src="/images/Galeri1.jpg" alt="gallery1" />
              </div>
              <div class="carousel-item">
                <img src="/images/Galeri2.jpg" alt="gallery2" />
              </div>
              <div class="carousel-item">
                <img src="/images/Galeri3.jpg" alt="gallery3" />
              </div>
              <div class="carousel-item">
                <img src="/images/Galeri4.jpg" alt="gallery4" />
              </div>
              <div class="carousel-item">
                <img src="/images/Galeri5.jpg" alt="gallery5" />
              </div>
              <div class="carousel-item">
                <img src="/images/Galeri6.jpg" alt="gallery6" />
              </div>
            </div>
          </div>
          <button class="carousel-nav carousel-nav-right" id="carousel-next">
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>

        <section class="learning-section">
          <h3>Mulai pembelajaran</h3>

          <div class="main-content">
            <!-- Kiri: Artikel + Video -->
            <div class="left-content">
              <div class="search-wrapper">
                <input type="text" id="search" placeholder="Search Title" />
                <i class="fa fa-search search-icon"></i>
              </div>

              <div id="article-list" class="article-list"></div>
            </div>

            <!-- Kanan: Filter -->
            <aside class="filter-box">
              <h4><i class="fa fa-filter"></i> Filter Materi</h4>
              <!-- isi filter -->
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

          <!-- BAWAH: video terakhir dilihat -->
          <section class="recent-section">
            <h3>Baru saja dipelajari</h3>
            <p><a href="#">Budidaya Tomat: Petunjuk, Persiapan, Pemupukan, Pemeliharaan</a></p>
            <div class="video-wrapper">
              <iframe src="https://www.youtube.com/embed/hY7m5jjJ9mM" allowfullscreen></iframe>
              <iframe src="https://www.youtube.com/embed/FTQbiNvZqaY" allowfullscreen></iframe>
            </div>
          </section>
        </section>
        </div>
        <footer class="home-footer">
          <p>&copy; 2025 AgriEdu. All rights reserved.</p>
        </footer>
      </div>
    `;
  }

  afterRender() {
    const container = document.getElementById("article-list");
    renderArticles(container, articles);

    document.getElementById("search").addEventListener("input", (e) => {
      const value = e.target.value;
      const filtered = getFilteredArticles(value);
      renderArticles(container, filtered);
    });

    // Set up carousel functionality
    this.setupCarousel();

    // Set up navigation bar events
    this.setupNavigationEvents();
  }

  setupCarousel() {
    const track = document.getElementById("carousel-track");
    const prevButton = document.getElementById("carousel-prev");
    const nextButton = document.getElementById("carousel-next");
    const items = track.querySelectorAll(".carousel-item");

    if (!track || !prevButton || !nextButton || items.length === 0) {
      console.error("Carousel elements not found");
      return;
    }

    let currentIndex = 2; // Start with the 3rd item centered (index 2)
    const totalItems = items.length;

    // Function to update carousel position and highlighting
    const updateCarousel = () => {
      // Remove all active classes
      items.forEach((item, index) => {
        item.classList.remove("active", "dimmed");

        // Calculate position relative to center
        const relativePosition = index - currentIndex;

        if (relativePosition === 0) {
          // Center item - highlighted
          item.classList.add("active");
        } else if (Math.abs(relativePosition) <= 2) {
          // Side items within view - dimmed
          item.classList.add("dimmed");
        }
      });

      // Calculate transform for centering - responsive item width
      const firstItem = items[0];
      const itemStyle = window.getComputedStyle(firstItem);
      const itemWidth =
        firstItem.offsetWidth +
        parseInt(itemStyle.marginLeft) +
        parseInt(itemStyle.marginRight);
      const containerWidth = track.parentElement.offsetWidth;
      const offset =
        -currentIndex * itemWidth + containerWidth / 2 - itemWidth / 2;
      track.style.transform = `translateX(${offset}px)`;
    };

    // Navigation event listeners
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
    });

    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    });

    // Initialize carousel
    updateCarousel();

    // Handle window resize
    window.addEventListener("resize", updateCarousel);
  }

  setupNavigationEvents() {
    // Set up navigation bar events using the NavigationBar component's centralized event handling
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    // Use the NavigationBar's built-in event binding
    navbar.bindEvents();
  }
}
