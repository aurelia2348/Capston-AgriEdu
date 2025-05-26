import { NavigationBar } from "../../components/NavigationBar.js";

export default class ChatbotPage {
  async render() {
    // Get user initial from localStorage
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
          <h1>Chatbot</h1>
        </section>
      </div>
    `;
  }

  async afterRender() {
    // Set up navigation bar events
    this.setupNavigationEvents();
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
