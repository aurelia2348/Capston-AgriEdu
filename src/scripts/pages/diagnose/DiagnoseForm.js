import { NavigationBar } from "../../components/NavigationBar.js";

export default class DiagnoseForm {
  async render() {
    const userName = localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = new NavigationBar({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      showProfile: true,
    });

    return `
      <div class="chatbot-page-container">
        ${navbar.render()}
        <section class="container">
          <h1>DiagnoseFormt</h1>
        </section>
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