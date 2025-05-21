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
    const view = new LandingPage(this.container);
    await view.render(this.services); // kirim services dari presenter
  }
}
