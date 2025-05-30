import learningService from "../../data/learning-service.js";

export const articles = [
  {
    type: "article",
    title: "Budidaya Tomat: Petunjuk, Persiapan, Pemupukan, Pemeliharaan",
    description:
      "Panduan lengkap budidaya tomat dari persiapan lahan hingga pemeliharaan untuk hasil optimal.",
    url: "https://www.nabilzaydan.com/2024/03/budidaya-padi-organik-panduan-lengkap.html",
    category: {
      experience: "pemula",
      plantType: "sayuran",
      method: "konvensional",
    },
    isFavorite: false,
  },
  {
    type: "article",
    title: "Mengenal 25 Jenis Tanaman Obat dan Manfaatnya",
    description:
      "Pelajari berbagai jenis tanaman obat yang mudah ditanam dan manfaatnya untuk kesehatan.",
    url: "https://yiari.or.id/tanaman-obat/",
    category: {
      experience: "menengah",
      plantType: "lainnya",
      method: "organik",
    },
    isFavorite: true,
  },
  {
    type: "article",
    title: "Penyakit Tanaman: Pengertian, Gejala, Beserta Jenisnya",
    description:
      "Mengenal berbagai penyakit tanaman, gejala yang muncul, dan cara penanganannya.",
    url: "https://indotechsci.co.id/penyakit-pada-tumbuhan-penyebab-gejala-dan-pengendaliannya/",
    category: {
      experience: "lanjutan",
      plantType: "lainnya",
      method: "konvensional",
    },
    isFavorite: false,
  },
];

function getYoutubeThumbnail(url) {
  const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/;
  const match = url.match(regex);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : "/images/default-video-thumb.jpg";
}

export const videos = [
  {
    type: "video",
    title: "Cara Memulai berkebun untuk Pemula",
    description:
      "Pelajari cara mudah memulai berkebun untuk pemula dan rekomendasi tanaman yang cocok dirawat di rumah. Cocok untuk kamu yang baru mulai!",
    url: "https://www.youtube.com/watch?v=W9bdw_YO84Q",
    thumbnail: getYoutubeThumbnail(
      "https://www.youtube.com/watch?v=W9bdw_YO84Q"
    ),
    category: {
      experience: "pemula",
      plantType: "sayuran",
      method: "hidroponik",
    },
    isFavorite: true,
  },
  {
    type: "video",
    title: "Cara Menanam Buah Naga dalam Pot",
    description:
      "Langkah mudah menanam buah naga dalam pot agar tanaman sehat dan cepat berbuah di rumah. Tips praktis dan efektif!",
    url: "https://www.youtube.com/watch?v=K01zRSw-Xgk",
    thumbnail: getYoutubeThumbnail(
      "https://www.youtube.com/watch?v=K01zRSw-Xgk"
    ),
    category: {
      experience: "lanjutan",
      plantType: "tanaman-hias",
      method: "konvensional",
    },
    isFavorite: false,
  },
  {
    type: "video",
    title: "Cara Menanam Tanaman Hias Agar Tumbuh Subur di Depan Rumah",
    description:
      "Langkah-langkah praktis menanam dan merawat tanaman hias agar tumbuh sehat dan subur di halaman depan rumah. Pelajari teknik perawatan dan penempatan yang tepat untuk hasil maksimal",
    url: "https://www.youtube.com/watch?v=vsGp3IXQa_o",
    thumbnail: getYoutubeThumbnail(
      "https://www.youtube.com/watch?v=vsGp3IXQa_o"
    ),
    category: {
      experience: "lanjutan",
      plantType: "tanaman-hias",
      method: "konvensional",
    },
    isFavorite: false,
  },
];

const CATEGORY_IDS = {
  experience: {
    pemula: "6837fe6c06bf979e73ffd611",
    menengah: "6837fe8c06bf979e73ffd61a",
    lanjutan: "6837fe9606bf979e73ffd61f",
  },
  plantType: {
    sayuran: "6838035e06bf979e73ffd64b",
    buah: "6838036d06bf979e73ffd650",
    "tanaman-hias": "6838037e06bf979e73ffd655",
    lainnya: "6838038a06bf979e73ffd65a",
  },
  method: {
    konvensional: "683803a806bf979e73ffd65f",
    hidroponik: "683803c306bf979e73ffd664",
    organik: "683803d006bf979e73ffd669",
    lainnya: "6838041b06bf979e73ffd671",
  },
};

function transformApiData(apiData) {
  return apiData.map((item) => {
    const experienceCategory = item.categories.find((c) =>
      Object.values(CATEGORY_IDS.experience).includes(c.id)
    );
    const plantTypeCategory = item.categories.find((c) =>
      Object.values(CATEGORY_IDS.plantType).includes(c.id)
    );
    const methodCategory = item.categories.find((c) =>
      Object.values(CATEGORY_IDS.method).includes(c.id)
    );

    const getCategoryName = (categoryId, categoryType) => {
      if (!categoryId) return "pemula";
      const mapping = CATEGORY_IDS[categoryType];
      return (
        Object.entries(mapping).find(([_, id]) => id === categoryId)?.[0] ||
        (categoryType === "plantType"
          ? "lainnya"
          : categoryType === "method"
          ? "konvensional"
          : "pemula")
      );
    };

    return {
      type: "article",
      title: item.title,
      description: item.summary,
      url: item.contentLink,
      category: {
        experience: getCategoryName(experienceCategory?.id, "experience"),
        plantType: getCategoryName(plantTypeCategory?.id, "plantType"),
        method: getCategoryName(methodCategory?.id, "method"),
      },
      isFavorite: false,
    };
  });
}

export async function fetchLearningData() {
  try {
    const response = await learningService.getAllLearning();
    if (response && response.learning) {
      const transformedData = transformApiData(response.learning);
      articles.length = 0;
      articles.push(...transformedData);
      return articles;
    }
    return articles;
  } catch (error) {
    console.error("Error fetching learning data:", error);
    return articles;
    return articles;
  }
}

export class LearningStorage {
  static FAVORITES_KEY = "agriedu_favorites";
  static RECENT_LEARNING_KEY = "agriedu_recent_learning";

  static loadFavorites() {
    try {
      const favorites = localStorage.getItem(this.FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : { articles: [], videos: [] };
    } catch (error) {
      console.error("Error loading favorites:", error);
      return { articles: [], videos: [] };
    }
  }

  static saveFavorites(favorites) {
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }

  static loadRecentLearning() {
    try {
      const recent = localStorage.getItem(this.RECENT_LEARNING_KEY);
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      console.error("Error loading recent learning:", error);
      return [];
    }
  }

  static saveRecentLearning(recentItems) {
    try {
      const limitedItems = recentItems.slice(0, 5);
      localStorage.setItem(
        this.RECENT_LEARNING_KEY,
        JSON.stringify(limitedItems)
      );
    } catch (error) {
      console.error("Error saving recent learning:", error);
    }
  }

  static addToRecentLearning(item) {
    const recent = this.loadRecentLearning();

    const filtered = recent.filter((r) => r.url !== item.url);

    filtered.unshift({
      ...item,
      timestamp: Date.now(),
    });

    this.saveRecentLearning(filtered);
  }

  static initializeFavorites() {
    const favorites = this.loadFavorites();

    articles.forEach((article, index) => {
      article.isFavorite = favorites.articles.includes(index);
    });

    videos.forEach((video, index) => {
      video.isFavorite = favorites.videos.includes(index);
    });
  }

  static toggleFavorite(index, type) {
    const favorites = this.loadFavorites();
    const dataArray = type === "video" ? videos : articles;
    const favoriteArray =
      type === "video" ? favorites.videos : favorites.articles;

    dataArray[index].isFavorite = !dataArray[index].isFavorite;

    if (dataArray[index].isFavorite) {
      if (!favoriteArray.includes(index)) {
        favoriteArray.push(index);
      }
    } else {
      const favIndex = favoriteArray.indexOf(index);
      if (favIndex > -1) {
        favoriteArray.splice(favIndex, 1);
      }
    }

    this.saveFavorites(favorites);
  }
}

export function getRecentLearning() {
  return LearningStorage.loadRecentLearning();
}
