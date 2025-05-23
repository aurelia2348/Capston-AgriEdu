import authService from "../../data/auth-service.js";

export default class Logout {
  async render() {
    return `
      <section class="container">
        <div class="logout-container">
          <h1>Logging Out...</h1>
          <p>Please wait while we log you out of your account.</p>
          <div class="loader"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    try {
      await authService.logout();

      setTimeout(() => {
        window.location.hash = "#/landing";
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      e;
      setTimeout(() => {
        window.location.hash = "#/landing";
      }, 1000);
    }
  }
}
