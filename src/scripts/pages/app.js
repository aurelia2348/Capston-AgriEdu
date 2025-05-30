import getRoutes from "../routes/routes.js";
import Link from "../components/Link.js";
import Router from "../routes/Router.js";
import authService from "../data/auth-service.js";
import { NavigationBar } from "../components/NavigationBar.js";

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;
    this.persistentNavbar = null;

    this.router = new Router();

    this.router.registerRoutes(getRoutes(content));

    this.router
      .beforeRoute((path) => {
        this.updateNavigationForRoute(path);
        return true;
      })
      .afterRoute(async (_, pageInstance) => {
        await this.renderPage(pageInstance);
      })
      .setNotFoundCallback((path) => {
        this.content.innerHTML = `
          <div class="error-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="#/landing">Go to Home</a>
          </div>
        `;
      });
  }

  async init() {
    this.checkAuthStatus();

    this.router.start();

    if (this.drawerButton && this.navigationDrawer) {
      this.drawerButton.addEventListener("click", () => {
        this.navigationDrawer.classList.toggle("open");
      });
    }
  }

  checkAuthStatus() {
    const isAuthenticated = authService.isAuthenticated();

    this.updateAuthUI(isAuthenticated);
  }

  updateAuthUI(isAuthenticated) {
    const loginLink = document.querySelector('a[href="#/login"]');
    const logoutLink = document.querySelector('a[href="#/logout"]');

    if (loginLink) {
      loginLink.style.display = isAuthenticated ? "none" : "block";
    }

    if (logoutLink) {
      logoutLink.style.display = isAuthenticated ? "block" : "none";
    }
  }

  updateNavigationForRoute(path) {
    if (this.shouldShowNavigation(path)) {
      this.initializeOrUpdateNavigation(path);
    }
  }

  shouldShowNavigation(path) {
    const noNavRoutes = ["/login", "/register", "/landing"];
    return !noNavRoutes.includes(path);
  }

  async initializeOrUpdateNavigation(path) {
    try {
      const userData = authService.getUserData();
      const userName = userData?.username || localStorage.getItem("user_name") || "User";
      const userInitial = userName.charAt(0).toUpperCase();

      if (!this.persistentNavbar) {
        this.persistentNavbar = NavigationBar.getInstance({
          currentPath: path,
          userInitial: userInitial,
          username: userName,
          profilePictureUrl: userData?.profilePictureUrl,
          showProfile: true,
        });
      } else {
        this.persistentNavbar.updateOptions({
          currentPath: path,
          userInitial: userInitial,
          username: userName,
          profilePictureUrl: userData?.profilePictureUrl,
          showProfile: true,
        });
      }
    } catch (error) {
      console.error("Error updating navigation:", error);
    }
  }

  async renderPage(pageInstance) {
    if (this.content && pageInstance) {
      try {

        const content = await pageInstance.render();

        if (content) {
          this.content.innerHTML = content;

          if (this.persistentNavbar && document.querySelector('.app-navbar')) {
            this.persistentNavbar.bindEvents();
          }

          if (pageInstance.afterRender) {
            await pageInstance.afterRender();
          }

          Link.updateLinks(this.content, this.router);

          this.setupInPageNavigation();
        } else {
          console.error(
            "Page render method returned undefined or empty content"
          );
          this.content.innerHTML =
            '<div class="error-container"><h2>Error rendering page</h2><p>The page content could not be loaded.</p></div>';
        }
      } catch (error) {
        console.error("Error rendering page:", error);
        this.content.innerHTML = `<div class="error-container"><h2>Error rendering page</h2><p>${error.message}</p></div>`;
      }
    } else {
      console.error("Content element missing or invalid page instance", {
        contentExists: !!this.content,
        pageInstanceExists: !!pageInstance,
      });
    }
  }

  setupInPageNavigation() {
  }
}

export default App;
