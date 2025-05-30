import authService from "../../data/auth-service.js";

export default class Logout {
  async render() {
    return `
      <section class="container">
        <div class="logout-container">
          <h1>Logging Out...</h1>
          <p>Terima kasih telah menggunakan AgriEdu. Anda akan segera dialihkan.</p>
          <div class="loader"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    try {
      await authService.logout();

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_name");

      setTimeout(() => {
        window.location.hash = "#/landing";
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        window.location.hash = "#/landing";
      }, 2000);
    }
  }
}
