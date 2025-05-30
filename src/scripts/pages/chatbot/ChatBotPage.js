import { NavigationBar } from "../../components/NavigationBar.js";
import ChatbotPresenter from "./ChatBotPage-Presenter.js";
import authService from "../../data/auth-service.js";

export default class ChatbotPage {
  async render() {
    const userData = authService.getUserData();
    const userName =
      userData?.username || localStorage.getItem("user_name") || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    const navbar = NavigationBar.getInstance({
      currentPath: window.location.hash.slice(1),
      userInitial: userInitial,
      username: userName,
      profilePictureUrl: userData?.profilePictureUrl,
      showProfile: true,
    });

    return `
      <div class="chatbot-fullscreen-container">
        ${navbar.render()}
        <section class="chatbot-wrapper">
          <h1 class="chatbot-welcome typing">
            <span class="text">Hai, selamat datang di ChatBot AgriEdu!</span><span class="cursor"></span>
          </h1>
          <p class="chatbot-desc typing-desc">
            <span class="text">Tanyakan apa saja pada ChatBot AgriEdu perihal tanamanmu</span><span class="cursor"></span>
          </p>
          <hr/>

          <div id="chat-container" class="chat-container"></div>
          <div class="input-container">
            <input type="text" id="chat-input" placeholder="Ketik pesan..." autocomplete="off" />
            <button id="send-btn">Kirim</button>
          </div>
        </section>
      </div>
`;
  }

  async afterRender() {
    this.setupNavigationEvents();

    const chatContainer = document.getElementById("chat-container");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    this.chatbot = new ChatbotPresenter(chatContainer, chatInput, sendBtn);
  }

  setupNavigationEvents() {
  }
}
