import getRoutes from "../routes/routes.js";
import Link from "../components/Link.js";
import Router from "../routes/Router.js";

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;

    this.router = new Router();

    this.router.registerRoutes(getRoutes(content));

    this.router
      .beforeRoute((path) => {
        console.log("Navigating to:", path);
        return true;
      })
      .afterRoute(async (_, pageInstance) => {
        await this.renderPage(pageInstance);
      })
      .setNotFoundCallback((path) => {
        console.error(`Page not found: ${path}`);
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
    this.router.start();

    if (this.drawerButton && this.navigationDrawer) {
      this.drawerButton.addEventListener("click", () => {
        this.navigationDrawer.classList.toggle("open");
      });
    }
  }

  async renderPage(pageInstance) {
    if (this.content && pageInstance) {
      try {
        console.log("Rendering page instance:", pageInstance);

        const content = await pageInstance.render();
        console.log(
          "Rendered content:",
          content ? "Content available" : "Content is undefined or empty"
        );

        if (content) {
          this.content.innerHTML = content;

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
    console.log("Setting up in-page navigation in App");
  }
}

export default App;
