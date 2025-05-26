import CommunityForm from "./ComunityForm.js";
import CommunityModel from "./ComunityPage-Model.js";

class CommunityPagePresenter {
  constructor(container) {
    this.container = container;
    this.formComponent = new CommunityForm();
    this.formComponent.presenter = this;
  }

  async init() {
    this.container.innerHTML = await this.formComponent.render();
    await this.formComponent.afterRender();

    document.addEventListener("submit-post", async (event) => {
      try {
        const formData = event.detail;

        const response = await CommunityModel.createPost(formData);
        document.getElementById("post-result").innerHTML = 
          `<p style="color:green;">Post berhasil dibuat dengan ID: ${response.data.id}</p>`;
      } catch (error) {
        document.getElementById("post-result").innerHTML = 
          `<p style="color:red;">Gagal membuat post: ${error.message}</p>`;
      }
    });
  }
}

export default CommunityPagePresenter;



