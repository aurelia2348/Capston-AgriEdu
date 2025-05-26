import { articles } from "./LearningPage-Model.js";
import {
  renderArticles,
  getFilteredArticles,
} from "./LearningPage-Presenter.js";

export default class LearningPage {
  constructor() {}

  render() {
    return `
      <div class="learning-container"> 
        <h2>Galeri <span class="highlight">Bertani</span></h2> 
        <div class="gallery"> 
          <img src="/images/Galeri1.jpg" alt="gallery1" /> 
          <img src="/images/Galeri2.jpg" alt="gallery2" /> 
          <img src="/images/Galeri3.jpg" alt="gallery3" /> 
          <img src="/images/Galeri4.jpg" alt="gallery4" /> 
          <img src="/images/Galeri5.jpg" alt="gallery5" />
          <img src="/images/Galeri6.jpg" alt="gallery6" />
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
  }
}
