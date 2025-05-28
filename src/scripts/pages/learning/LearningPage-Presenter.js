import {
  articles,
  videos,
  LearningStorage,
  getRecentLearning,
} from "./LearningPage-Model.js";

function convertToEmbedUrl(url) {
  // Support untuk berbagai format youtube
  const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function renderArticles(container, list) {
  container.innerHTML = "";

  list.forEach((item, index) => {
    const articleElement = document.createElement("div");
    articleElement.className = "learning-item";

    const heartIcon = item.isFavorite ? "fas fa-heart" : "far fa-heart";
    const heartClass = item.isFavorite ? "favorite-active" : "";

    articleElement.innerHTML = `
      <div class="learning-item-header">
        <h4 class="article-title" data-url="${item.url}">${item.title}</h4>
        <button class="favorite-btn ${heartClass}" data-index="${index}" data-type="${
      item.type
    }">
          <i class="${heartIcon}"></i>
        </button>
      </div>
      <p class="learning-item-description">${item.description || ""}</p>
    `;

    // Add click listener for article title
    const titleElement = articleElement.querySelector(".article-title");
    titleElement.addEventListener("click", () => {
      trackArticleClick(item);
      window.open(item.url, "_blank");
    });

    container.appendChild(articleElement);
  });

  // FIXED: jangan pasang event listener di sini supaya gak dobel saat render ulang
  // Pindahkan event listener favorite di luar fungsi renderArticles
}

function getYoutubeThumbnail(url) {
  const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/;
  const match = url.match(regex);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : "/images/default-video-thumb.jpg";
}

export function renderVideos(container, videoList) {
  container.innerHTML = "";

  videoList.forEach((video, index) => {
    const videoElement = document.createElement("div");
    videoElement.className = "video-item";

    const heartIcon = video.isFavorite ? "fas fa-heart" : "far fa-heart";
    const heartClass = video.isFavorite ? "favorite-active" : "";
    const thumbnailUrl = getYoutubeThumbnail(video.url);

    videoElement.innerHTML = `
      <div class="video-thumbnail">
        <div class="video-play-overlay">
          <i class="fas fa-play"></i>
        </div>
        <img src="${thumbnailUrl}" alt="${video.title}" onerror="this.src='/images/default-video-thumb.jpg'">
      </div>
      <div class="video-content">
        <div class="video-header">
          <h4>${video.title}</h4>
          <button class="favorite-btn ${heartClass}" data-index="${index}" data-type="video">
            <i class="${heartIcon}"></i>
          </button>
        </div>
        <p class="video-description">${video.description}</p>
      </div>
    `;

    // Click untuk buka modal video
    videoElement.addEventListener("click", (e) => {
      if (!e.target.closest(".favorite-btn")) {
        openVideoModal(video);
      }
    });

    container.appendChild(videoElement);
  });

  // FIXED: jangan pasang event listener di sini supaya gak dobel saat render ulang
  // Pindahkan event listener favorite di luar fungsi renderVideos
}

function toggleFavorite(index, type, button) {
  // Use LearningStorage to toggle favorite
  LearningStorage.toggleFavorite(index, type);

  const dataArray = type === "video" ? videos : articles;
  const icon = button.querySelector("i");

  if (dataArray[index].isFavorite) {
    icon.className = "fas fa-heart";
    button.classList.add("favorite-active");
  } else {
    icon.className = "far fa-heart";
    button.classList.remove("favorite-active");
  }
}

function openVideoModal(video) {
  const embedUrl = convertToEmbedUrl(video.url);
  if (!embedUrl) {
    Swal.fire({
      icon: "error",
      title: "Video tidak valid",
      text: "Video URL tidak valid dan tidak bisa diputar.",
      showConfirmButton: false,
      timer: 3000,
    });
    return;
  }

  // Add to recent learning when video is opened
  LearningStorage.addToRecentLearning({
    type: video.type,
    title: video.title,
    description: video.description,
    url: video.url,
    thumbnail: video.thumbnail,
  });

  const modal = document.createElement("div");
  modal.className = "video-modal";
  modal.innerHTML = `
    <div class="video-modal-content">
      <button class="video-modal-close">&times;</button>
      <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal events
  modal.addEventListener("click", (e) => {
    if (
      e.target === modal ||
      e.target.classList.contains("video-modal-close")
    ) {
      document.body.removeChild(modal);
      removeEscListener();
    }
  });

  // FIXED: close modal juga dengan ESC key
  function escListener(e) {
    if (e.key === "Escape") {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
        removeEscListener();
      }
    }
  }
  function removeEscListener() {
    window.removeEventListener("keydown", escListener);
  }
  window.addEventListener("keydown", escListener);
}

// Add function to track article clicks
export function trackArticleClick(article) {
  LearningStorage.addToRecentLearning({
    type: article.type,
    title: article.title,
    description: article.description,
    url: article.url,
  });
}

// Render recent learning section
export function renderRecentLearning(container) {
  const recentItems = getRecentLearning();

  if (!container) return;

  if (recentItems.length === 0) {
    container.innerHTML = `
      <div class="no-recent-learning">
        <p>Belum ada pembelajaran yang baru saja dipelajari.</p>
        <p>Mulai belajar dengan mengklik artikel atau video di atas!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recentItems
    .map((item) => {
      if (item.type === "video") {
        return `
        <div class="recent-video-item" data-url="${item.url}">
          <div class="recent-video-thumbnail">
            <div class="video-play-overlay">
              <i class="fas fa-play"></i>
            </div>
            <img src="${item.thumbnail || "/images/default-video-thumb.jpg"}"
                 alt="${item.title}"
                 onerror="this.src='/images/default-video-thumb.jpg'">
          </div>
          <div class="recent-video-content">
            <h5>${item.title}</h5>
            <p>${item.description}</p>
            <small class="recent-timestamp">${formatTimestamp(
              item.timestamp
            )}</small>
          </div>
        </div>
      `;
      } else {
        return `
        <div class="recent-article-item" data-url="${item.url}">
          <div class="recent-article-content">
            <h5>${item.title}</h5>
            <p>${item.description}</p>
            <small class="recent-timestamp">${formatTimestamp(
              item.timestamp
            )}</small>
          </div>
        </div>
      `;
      }
    })
    .join("");

  // Add click listeners for recent items
  container.querySelectorAll(".recent-video-item").forEach((item) => {
    item.addEventListener("click", () => {
      const url = item.dataset.url;
      const video = videos.find((v) => v.url === url);
      if (video) {
        openVideoModal(video);
      }
    });
  });

  container.querySelectorAll(".recent-article-item").forEach((item) => {
    item.addEventListener("click", () => {
      const url = item.dataset.url;
      window.open(url, "_blank");
    });
  });
}

// Format timestamp for display
function formatTimestamp(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days < 7) return `${days} hari yang lalu`;
  return new Date(timestamp).toLocaleDateString("id-ID");
}

// FIXED: Event delegation untuk favorite button, pasang event listener sekali saja
export function setupFavoriteListeners(articleContainer, videoContainer) {
  articleContainer.addEventListener("click", (e) => {
    if (e.target.closest(".favorite-btn")) {
      const btn = e.target.closest(".favorite-btn");
      const index = parseInt(btn.dataset.index);
      const type = btn.dataset.type;
      toggleFavorite(index, type, btn);
    }
  });

  videoContainer.addEventListener("click", (e) => {
    if (e.target.closest(".favorite-btn")) {
      e.stopPropagation();
      const btn = e.target.closest(".favorite-btn");
      const index = parseInt(btn.dataset.index);
      toggleFavorite(index, "video", btn);
    }
  });
}

export function getFilteredArticles(keyword, filters = {}) {
  let filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(keyword.toLowerCase())
  );

  // Apply category filters
  if (filters.experience && filters.experience.length > 0) {
    filteredArticles = filteredArticles.filter((article) =>
      filters.experience.includes(article.category.experience)
    );
  }

  if (filters.plantType && filters.plantType.length > 0) {
    filteredArticles = filteredArticles.filter((article) =>
      filters.plantType.includes(article.category.plantType)
    );
  }

  if (filters.method && filters.method.length > 0) {
    filteredArticles = filteredArticles.filter((article) =>
      filters.method.includes(article.category.method)
    );
  }

  if (filters.showFavorites) {
    filteredArticles = filteredArticles.filter((article) => article.isFavorite);
  }

  return filteredArticles;
}

export function getFilteredVideos(keyword, filters = {}) {
  let filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(keyword.toLowerCase())
  );

  // Apply category filters
  if (filters.experience && filters.experience.length > 0) {
    filteredVideos = filteredVideos.filter((video) =>
      filters.experience.includes(video.category.experience)
    );
  }

  if (filters.plantType && filters.plantType.length > 0) {
    filteredVideos = filteredVideos.filter((video) =>
      filters.plantType.includes(video.category.plantType)
    );
  }

  if (filters.method && filters.method.length > 0) {
    filteredVideos = filteredVideos.filter((video) =>
      filters.method.includes(video.category.method)
    );
  }

  if (filters.showFavorites) {
    filteredVideos = filteredVideos.filter((video) => video.isFavorite);
  }

  return filteredVideos;
}
