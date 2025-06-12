import {
  articles,
  videos,
  LearningStorage,
  fetchLearningData,
} from "./LearningPage-Model.js";
import Swal from "sweetalert2";
import {
  renderArticles,
  renderVideos,
  getFilteredArticles,
  getFilteredVideos,
  setupFavoriteListeners,
  renderRecentLearning,
} from "./LearningPage-Presenter.js";
import { NavigationBar } from "../../components/NavigationBar.js";
import authService from "../../data/auth-service.js";
import learningService from "../../data/learning-service.js";

const CATEGORY_IDS = {
  experience: {
    pemula: "684a9862cb667731eed9469f",
    menengah: "684a9862cb667731eed946a1",
    lanjutan: "684a9862cb667731eed946a3",
  },
  plantType: {
    sayuran: "684a9862cb667731eed946a5",
    buah: "684a9862cb667731eed946a7",
    tanamanHias: "684a9862cb667731eed946a9",
    lainnya: "684a9862cb667731eed946ab",
  },
  method: {
    konvensional: "684a9862cb667731eed946ad",
    hidroponik: "684a9862cb667731eed946af",
    organik: "684a9862cb667731eed946b1",
    lainnya: "684a9862cb667731eed946b3",
  },
};

export default class LearningPage {
  constructor() {}

  render() {
    const userData = authService.getUserData();
    const userName =
      userData?.username || localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();
    const isAdmin = userData && userData.role === "admin";

    const navbar = NavigationBar.getInstance({
      currentPath: window.location.hash.slice(1),
      userInitial,
      username: userName,
      profilePictureUrl: userData?.profilePictureUrl,
      showProfile: true,
    });

    return `
      <div class="learning-page">
        ${navbar.render()}
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
                <div id="pagination" class="pagination"></div>
              </div>

              <aside class="learning-filter-panel">
                <h4><i class="fa fa-filter"></i> Filter Materi</h4>
                ${isAdmin ? `
                  <button id="add-learning-btn" class="add-learning-btn">
                    <i class="fas fa-plus"></i> Tambah Materi
                  </button>
                ` : ''}

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
                  <label><input type="checkbox" value="tanamanHias" name="plantType" /> Tanaman Hias</label>
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
        ${isAdmin ? `
          <div id="add-learning-modal" class="modal" style="display: none;">
            <div class="modal-overlay"></div>
            <div class="modal-content">
              <div class="modal-header">
                <h2>Tambah Materi Pembelajaran</h2>
                <button class="modal-close" onclick="this.closest('.modal').style.display='none'">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="modal-body">
                <form id="add-learning-form">
                  <div class="form-group">
                    <label for="title">Judul Materi</label>
                    <input type="text" id="title" name="title" required placeholder="Masukkan judul materi" />
                  </div>

                  <div class="form-group">
                    <label for="summary">Ringkasan</label>
                    <textarea id="summary" name="summary" required placeholder="Masukkan ringkasan materi" rows="3"></textarea>
                  </div>

                  <div class="form-group">
                    <label for="contentLink">Link Konten</label>
                    <input type="url" id="contentLink" name="contentLink" required placeholder="Masukkan link konten (URL)" />
                  </div>

                  <div class="form-group">
                    <label>Kategori</label>
                    <div class="category-options">
                      <div class="category-section">
                        <h4>Level Pengalaman</h4>
                        <label><input type="checkbox" name="categories" value="pemula" data-id="${CATEGORY_IDS.experience.pemula}" /> Pemula</label>
                        <label><input type="checkbox" name="categories" value="menengah" data-id="${CATEGORY_IDS.experience.menengah}" /> Menengah</label>
                        <label><input type="checkbox" name="categories" value="lanjutan" data-id="${CATEGORY_IDS.experience.lanjutan}" /> Lanjutan</label>
                      </div>
                      <div class="category-section">
                        <h4>Jenis Tanaman</h4>
                        <label><input type="checkbox" name="categories" value="sayuran" data-id="${CATEGORY_IDS.plantType.sayuran}" /> Sayuran</label>
                        <label><input type="checkbox" name="categories" value="buah" data-id="${CATEGORY_IDS.plantType.buah}" /> Buah</label>
                        <label><input type="checkbox" name="categories" value="tanamanHias" data-id="${CATEGORY_IDS.plantType.tanamanHias}" /> Tanaman Hias</label>
                        <label><input type="checkbox" name="categories" value="lainnya" data-id="${CATEGORY_IDS.plantType.lainnya}" /> Lainnya</label>
                      </div>
                      <div class="category-section">
                        <h4>Metode</h4>
                        <label><input type="checkbox" name="categories" value="konvensional" data-id="${CATEGORY_IDS.method.konvensional}" /> Konvensional</label>
                        <label><input type="checkbox" name="categories" value="hidroponik" data-id="${CATEGORY_IDS.method.hidroponik}" /> Hidroponik</label>
                        <label><input type="checkbox" name="categories" value="organik" data-id="${CATEGORY_IDS.method.organik}" /> Organik</label>
                        <label><input type="checkbox" name="categories" value="lainnya" data-id="${CATEGORY_IDS.method.lainnya}" /> Lainnya</label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" class="submit-btn">Tambah Materi</button>
                </form>
              </div>
            </div>
          </div>
        ` : ''}
        <footer class="page-footer">
          <p>&copy; 2025 AgriEdu. All rights reserved.</p>
        </footer>
      </div>
    `;
  }

  async afterRender() {
    LearningStorage.initializeFavorites();

    const articleContainer = document.getElementById("article-grid");
    const videoContainer = document.getElementById("video-grid");
    const recentContainer = document.getElementById(
      "recent-learning-container"
    );

    articleContainer.innerHTML =
      '<div class="loading">Memuat materi pembelajaran...</div>';

    try {
      await fetchLearningData();

      renderArticles(articleContainer, articles);
      renderVideos(videoContainer, videos);

      renderRecentLearning(recentContainer);

      setupFavoriteListeners(articleContainer, videoContainer);

      this.setupSearchAndFilters(articleContainer, videoContainer);

      const userData = authService.getUserData();
      const isAdmin = userData && userData.role === "admin";

      if (isAdmin) {
        const addLearningBtn = document.getElementById("add-learning-btn");
        const addLearningModal = document.getElementById("add-learning-modal");
        const addLearningForm = document.getElementById("add-learning-form");

        if (addLearningBtn && addLearningModal && addLearningForm) {
          addLearningBtn.addEventListener("click", () => {
            addLearningModal.style.display = "flex";
          });

          addLearningModal
            .querySelector(".modal-overlay")
            .addEventListener("click", () => {
              addLearningModal.style.display = "none";
            });

          addLearningForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const selectedCategories = Array.from(
              document.querySelectorAll('input[name="categories"]:checked')
            ).map((cb) => cb.dataset.id);

            const formData = {
              title: document.getElementById("title").value,
              summary: document.getElementById("summary").value,
              contentLink: document.getElementById("contentLink").value,
              categories: selectedCategories,
            };

            try {
              const result = await learningService.createLearning(formData);

              articles.unshift({
                type: "article",
                id: result.learning.id,
                title: result.learning.title,
                description: result.learning.summary,
                url: result.learning.contentLink,
                category: {
                  experience:
                    Object.entries(CATEGORY_IDS.experience).find(([_, id]) =>
                      result.learning.categories.some((c) => c.id === id)
                    )?.[0] || "pemula",
                  plantType:
                    Object.entries(CATEGORY_IDS.plantType).find(([_, id]) =>
                      result.learning.categories.some((c) => c.id === id)
                    )?.[0] || "lainnya",
                  method:
                    Object.entries(CATEGORY_IDS.method).find(([_, id]) =>
                      result.learning.categories.some((c) => c.id === id)
                    )?.[0] || "konvensional",
                },
                isFavorite: false,
              });

              renderArticles(articleContainer, articles);

              addLearningModal.style.display = "none";
              addLearningForm.reset();

              Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Materi pembelajaran berhasil ditambahkan!",
                showConfirmButton: false,
                timer: 3000,
              });
            } catch (error) {
              console.error("Error adding learning:", error);
              Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Gagal menambahkan materi pembelajaran. Silakan coba lagi.",
                showConfirmButton: false,
                timer: 3000,
              });
            }
          });
        }
      }

      // Setup favorite filter
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

      this.addClearFiltersButton(articleContainer, videoContainer);
      this.setupGalleryCarousel();

    } catch (error) {
      console.error("Error loading learning data:", error);
      articleContainer.innerHTML = `
        <div class="error-message">
          <p>Gagal memuat materi pembelajaran: ${error.message}</p>
          <button onclick="location.reload()">Coba Lagi</button>
        </div>
      `;
    }
  }

  setupSearchAndFilters(articleContainer, videoContainer) {
    document.getElementById("search").addEventListener("input", () => {
      this.applyFilters(articleContainer, videoContainer);
    });

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

    Object.assign(filters, extraFilters);

    const filteredArticles = getFilteredArticles(keyword, filters);
    const filteredVideos = getFilteredVideos(keyword, filters);

    renderArticles(articleContainer, filteredArticles);
    renderVideos(videoContainer, filteredVideos);

    setupFavoriteListeners(articleContainer, videoContainer);

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

    const clearFiltersBtn = document.createElement("button");
    clearFiltersBtn.className = "clear-filters-btn";
    clearFiltersBtn.innerHTML =
      '<i class="fa fa-times"></i> Hapus Semua Filter';

    const hr = filterPanel.querySelector("hr");
    if (hr && hr.nextSibling) {
      hr.parentNode.insertBefore(clearFiltersBtn, hr.nextSibling.nextSibling);
    } else {
      filterPanel.appendChild(clearFiltersBtn);
    }

    clearFiltersBtn.addEventListener("click", () => {
      document.getElementById("search").value = "";

      document
        .querySelectorAll('.learning-filter-panel input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.checked = false;
        });

      const favoriteBtn = document.getElementById("favorite-filter");
      favoriteBtn.classList.remove("active");
      favoriteBtn.innerHTML = '<i class="fa fa-heart"></i> Lihat Favorite';

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

    let currentIndex = 2;
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
      });

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
