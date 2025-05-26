import { NavigationBar } from "../../components/NavigationBar.js";

export default class CommunityPage {
  async render() {
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    return `
      <div class="community-page-container">
        ${navbar.render()}
        
        <section class="community-banner">
          <div class="banner-content">
            <img src="logo/Comunity-Main.png" alt="Community Icon" class="banner-icon" />
            <div class="banner-text">
              <h2>Selamat datang di Komunitas AgriEdu!</h2>
              <p>Komunitas untuk saling berbagi solusi dan pengalaman bercocok tanam. Mulai berbagi pengalaman Anda.</p>
            </div>
          </div>
          
        </section>

        <div class="profile-container">
          <aside class="profile-sidebar">
            <div class="sidebar-avatar">
              <img src="images/avatar.jpg" alt="Avatar" class="avatar" id="sidebarAvatar"/>
              <p id="sidebarUsername">Username User</p>
              <p id="sidebarExperience">Experience Level</p>
              <button class="sidebar-button">Unggah diskusi</button>
            </div>
          </aside>

          <main class="community-content">
          
            <h1>Community</h1>
            <p>Ini tempat main content</p>
          </main>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.setupNavigationEvents();
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
