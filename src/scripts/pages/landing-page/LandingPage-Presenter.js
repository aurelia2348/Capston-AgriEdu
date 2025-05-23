import { LandingPage } from "./LandingPage";

export default class LandingPresenter {
  constructor(container) {
    this.container = container;
    this.services = [
      {
        title: "Interactive Learning",
        description: "Online courses & tutorials on smart farming.",
        icon: "logo/Learning-Logo.png",
        image: "images/ServicesLearning-LandingPage.jpg",
      },
      {
        title: "Community Forum",
        description: "Forum to share and discuss with fellow farmers.",
        icon: "logo/Discuss-Logo.png",
        image: "images/ServicesComunity-LandingPage.jpg",
      },
      {
        title: "AI Plant Diagnosis",
        description: "Detect plant diseases instantly with AI.",
        icon: "logo/Diagnosa-Logo.png",
        image: "images/ServicesAi-LandingPage.jpg",
      },
      {
        title: "Chatbot & Assistant AI",
        description: "Chatbot & smart assistant for farming help.",
        icon: "logo/Chatbot-Logo.png",
        image: "images/ServicesChatbot-LandingPage.jpg",
      },
    ];
  }

  async render() {
    try {
      console.log(
        "LandingPresenter render called, container:",
        this.container ? "exists" : "missing"
      );
      const view = new LandingPage(this.container);
      const html = await view.render(this.services);
      return html;
    } catch (error) {
      console.error("Error in LandingPresenter render:", error);
      return `<div class="error-container">
        <h2>Error Loading Landing Page</h2>
        <p>${error.message}</p>
      </div>`;
    }
  }

  async afterRender() {
    console.log("LandingPresenter afterRender called");

    try {
      console.log("Creating LandingPage view instance");
      const view = new LandingPage(this.container);
      console.log("Calling view.afterRender()");
      await view.afterRender();
      console.log("View afterRender completed");
    } catch (error) {
      console.error("Error in LandingPresenter afterRender:", error);
    }
  }
}
