import CommunityForm from "./ComunityForm.js";
import CommunityModel from "./ComunityPage-Model.js";

class CommunityPagePresenter {
  constructor(container) {
    this.container = container;
    this.formComponent = new CommunityForm();
    this.formComponent.presenter = this;
    this._hasBoundSubmitHandler = false;
  }

  async render() {
    return await this.formComponent.render();
  }

  async afterRender() {
    await this.formComponent.afterRender();

    if (!this._hasBoundSubmitHandler) {
      document.addEventListener("submit-post", this._handleSubmit.bind(this));
      this._hasBoundSubmitHandler = true;
    }
  }

  async init() {
    this.container.innerHTML = await this.formComponent.render();
    await this.formComponent.afterRender();

    if (!this._hasBoundSubmitHandler) {
      document.addEventListener("submit-post", this._handleSubmit.bind(this));
      this._hasBoundSubmitHandler = true;
    }
  }

  async _handleSubmit(event) {
    try {
      const formData = event.detail;
      const response = await CommunityModel.createPost(formData);

      document.getElementById("post-result").innerHTML = `
        <p style="color: green; margin-top: 10px;">
          ✅ Post berhasil dibuat! Mengalihkan ke halaman diskusi...
        </p>
      `;

      this.formComponent?.resetForm?.();

      setTimeout(() => {
        window.location.hash = "#/community";
      }, 1000);
    } catch (error) {
      if (
        error.message.includes("Sesi Anda telah berakhir") ||
        error.message.includes("belum login")
      ) {
        document.getElementById("post-result").innerHTML = `
          <p style="color: red; margin-top: 10px;">
            ❌ ${error.message} Mengalihkan ke halaman login...
          </p>
        `;

        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
        return;
      }

      document.getElementById("post-result").innerHTML = `
        <p style="color: red; margin-top: 10px;">
          ❌ Gagal membuat post: ${error.message}
        </p>
      `;

      const submitButton = document.querySelector(
        '#create-post-form button[type="submit"]'
      );
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Kirim diskusi";
      }
    }
  }
}

export default CommunityPagePresenter;
