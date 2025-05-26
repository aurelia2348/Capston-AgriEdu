import { articles } from "./LearningPage-Model.js";

function convertToEmbedUrl(url) {
  const match = url.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export function renderArticles(container, list) {
  container.innerHTML = "";
  list.forEach((article) => {
    const item = document.createElement("div");
    item.className = "article-item";

    if (article.type === "video") {
      const embedUrl = convertToEmbedUrl(article.videoUrl);
      item.innerHTML = `
        <h4>${article.title}</h4>
        <div class="video-wrapper">
          <iframe width="100%" height="200"
            src="${embedUrl}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      `;
    } else if (article.type === "article") {
      item.innerHTML = `
        <h4>${article.title}</h4>
        <div class="article-wrapper">
          <a href="${article.articleUrl}" target="_blank" class="article-link">
            <i class="fas fa-file-alt"></i> Baca Artikel
          </a>
        </div>
      `;
    }

    container.appendChild(item);
  });
}

export function getFilteredArticles(keyword) {
  return articles.filter((article) =>
    article.title.toLowerCase().includes(keyword.toLowerCase())
  );
}
