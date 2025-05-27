import { articles, videos, LearningStorage } from "./LearningPage-Model.js";
import {
  renderArticles,
  renderVideos,
  getFilteredArticles,
  getFilteredVideos,
  setupFavoriteListeners,
  renderRecentLearning,
} from "./LearningPage-Presenter.js";
import { NavigationBar } from "../../components/NavigationBar.js";

export default class LearningPage {
  constructor() {
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    this.navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial,
      showProfile: true,
    });
  }

  render() {
    return `
      <div class="learning-page">
        ${this.navbar.render()}
        <div class="learning-content">
          <h2>Galeri <span class="highlight">Bertani</span></h2>

          <div class="gallery-carousel">
            <button
              class="gallery-carousel-nav gallery-carousel-left"
              id="gallery-prev"
              aria-label="Previous gallery slide"
              title="Previous"
            >
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
            <button
              class="gallery-carousel-nav gallery-carousel-right"
              id="gallery-next"
              aria-label="Next gallery slide"
              title="Next"
            >
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>

          <section class="learning-section">
            <h3>Mulai pembelajaran</h3>

            <div class="learning-main">
              <div class="learning-content-area">
                <div class="learning-search">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search Title"
                    aria-label="Search learning materials"
                  />
                  <i class="fa fa-search search-icon"></i>
                </div>
                <div id="article-grid" class="learning-grid"></div>
              </div>

              <aside class="learning-filter-panel">
                <h4><i class="fa fa-filter"></i> Filter Materi</h4>

                <div class="filter-group">
                  <strong>Pengalaman</strong>
                  <label><input type="checkbox" value="pemula" name="experience" /> Pemula</label>
                  <label><input type="checkbox" value="menengah" name="experience" /> Menengah</label>
                  <label><input type="checkbox" value="lanjutan" name="experience" /> Lanjutan</label>
                </div>

                <div class="filter-group">
                  <strong>Jenis Tanaman</strong>
                  <label><input type="checkbox" value="sayuran" name="plantType" /> Sayuran</label>
                  <label><input type="checkbox" value="buah" name="plantType" /> Buah</label>
                  <label><input type="checkbox" value="tanaman-hias" name="plantType" /> Tanaman Hias</label>
                  <label><input type="checkbox" value="lainnya" name="plantType" /> Lainnya</label>
                </div>

                <div class="filter-group">
                  <strong>Metode</strong>
                  <label><input type="checkbox" value="konvensional" name="method" /> Konvensional</label>
                  <label><input type="checkbox" value="hidroponik" name="method" /> Hidroponik</label>
                  <label><input type="checkbox" value="organik" name="method" /> Organik</label>
                  <label><input type="checkbox" value="lainnya" name="method" /> Lainnya</label>
                </div>

                <hr />
                <button class="favorite-filter-btn" id="favorite-filter" aria-label="Filter favorites" title="Lihat Favorite">
                  <i class="fa fa-heart"></i> Lihat Favorite
                </button>
              </aside>
            </div>

            <section class="video-section">
              <h3>Video Pembelajaran Terkait</h3>
              <div id="video-grid" class="video-grid"></div>
            </section>

            <section class="recent-learning">
              <h3>Baru saja dipelajari</h3>
              <div class="recent-learning-content" id="recent-learning-container">
                <!-- Recent learning items will be rendered here dynamically -->
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
    // Initialize favorites from localStorage
    LearningStorage.initializeFavorites();

    const articleContainer = document.getElementById("article-grid");
    const videoContainer = document.getElementById("video-grid");
    const recentContainer = document.getElementById(
      "recent-learning-container"
    );

    // Render initial articles and videos
    renderArticles(articleContainer, articles);
    renderVideos(videoContainer, videos);

    // Render recent learning
    renderRecentLearning(recentContainer);

    // Setup favorite buttons event listeners
    setupFavoriteListeners(articleContainer, videoContainer);

    // Setup search and filter listeners
    this.setupSearchAndFilters(articleContainer, videoContainer);

    // Favorite filter button with improved feedback
    const favoriteBtn = document.getElementById("favorite-filter");
    let showingFavorites = false;

    favoriteBtn.addEventListener("click", () => {
      showingFavorites = !showingFavorites;

      if (showingFavorites) {
        favoriteBtn.classList.add("active");
        favoriteBtn.innerHTML = '<i class="fa fa-heart"></i> Semua Materi';
        this.applyFilters(articleContainer, videoContainer, {
          showFavorites: true,
        });
      } else {
        favoriteBtn.classList.remove("active");
        favoriteBtn.innerHTML = '<i class="fa fa-heart"></i> Lihat Favorite';
        this.applyFilters(articleContainer, videoContainer);
      }
    });

    // Add clear filters button
    this.addClearFiltersButton(articleContainer, videoContainer);

    // Setup gallery carousel
    this.setupGalleryCarousel();

    // Bind navigation bar events
    this.navbar.bindEvents();
  }

  setupSearchAndFilters(articleContainer, videoContainer) {
    // Search input listener
    document.getElementById("search").addEventListener("input", () => {
      this.applyFilters(articleContainer, videoContainer);
    });

    // Filter checkboxes listener
    const filterCheckboxes = document.querySelectorAll(
      '.learning-filter-panel input[type="checkbox"]'
    );
    filterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.applyFilters(articleContainer, videoContainer);
      });
    });
  }

  applyFilters(articleContainer, videoContainer, extraFilters = {}) {
    const keyword = document.getElementById("search").value || "";
    const filters = this.getActiveFilters();

    // Merge extra filters (e.g., showFavorites)
    Object.assign(filters, extraFilters);

    const filteredArticles = getFilteredArticles(keyword, filters);
    const filteredVideos = getFilteredVideos(keyword, filters);

    // Render filtered content
    renderArticles(articleContainer, filteredArticles);
    renderVideos(videoContainer, filteredVideos);

    // Re-bind favorite buttons event listeners after re-rendering
    setupFavoriteListeners(articleContainer, videoContainer);

    // Refresh recent learning in case favorites changed
    const recentContainer = document.getElementById(
      "recent-learning-container"
    );
    if (recentContainer) {
      renderRecentLearning(recentContainer);
    }
  }

  addClearFiltersButton(articleContainer, videoContainer) {
    const filterPanel = document.querySelector(".learning-filter-panel");
    if (!filterPanel) return;

    // Add clear filters button after the favorite filter button
    const clearFiltersBtn = document.createElement("button");
    clearFiltersBtn.className = "clear-filters-btn";
    clearFiltersBtn.innerHTML =
      '<i class="fa fa-times"></i> Hapus Semua Filter';

    // Insert after the hr element
    const hr = filterPanel.querySelector("hr");
    if (hr && hr.nextSibling) {
      hr.parentNode.insertBefore(clearFiltersBtn, hr.nextSibling.nextSibling);
    } else {
      filterPanel.appendChild(clearFiltersBtn);
    }

    clearFiltersBtn.addEventListener("click", () => {
      // Clear search
      document.getElementById("search").value = "";

      // Uncheck all filter checkboxes
      document
        .querySelectorAll('.learning-filter-panel input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.checked = false;
        });

      // Reset favorite filter button
      const favoriteBtn = document.getElementById("favorite-filter");
      favoriteBtn.classList.remove("active");
      favoriteBtn.innerHTML = '<i class="fa fa-heart"></i> Lihat Favorite';

      // Apply empty filters
      this.applyFilters(articleContainer, videoContainer);
    });
  }

  getActiveFilters() {
    const filters = {
      experience: [],
      plantType: [],
      method: [],
    };

    document
      .querySelectorAll('input[name="experience"]:checked')
      .forEach((input) => filters.experience.push(input.value));
    document
      .querySelectorAll('input[name="plantType"]:checked')
      .forEach((input) => filters.plantType.push(input.value));
    document
      .querySelectorAll('input[name="method"]:checked')
      .forEach((input) => filters.method.push(input.value));

    return filters;
  }

  setupGalleryCarousel() {
    const track = document.getElementById("gallery-track");
    const prevButton = document.getElementById("gallery-prev");
    const nextButton = document.getElementById("gallery-next");
    const slides = track ? track.querySelectorAll(".gallery-slide") : [];

    if (!track || !prevButton || !nextButton || slides.length === 0) {
      console.error("Gallery carousel elements not found");
      return;
    }

    let currentIndex = 2; // Start with the 3rd slide active (index 2)
    const totalSlides = slides.length;

    const updateGallery = () => {
      if (!slides.length) return;

      slides.forEach((slide, index) => {
        slide.classList.remove("active", "dimmed");

        const relativePosition = index - currentIndex;

        if (relativePosition === 0) {
          slide.classList.add("active");
        } else if (Math.abs(relativePosition) <= 2) {
          slide.classList.add("dimmed");
        }
        // Slides farther than 2 positions from active remain normal
      });

      // Calculate offset to center active slide
      const firstSlide = slides[0];
      const slideStyle = window.getComputedStyle(firstSlide);
      const slideWidth =
        firstSlide.offsetWidth +
        parseFloat(slideStyle.marginLeft) +
        parseFloat(slideStyle.marginRight);
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
}
