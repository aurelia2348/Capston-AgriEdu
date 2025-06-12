import CONFIG_CHATBOT from "./config.js";

export default class ChatbotPresenter {
  constructor(chatContainer, inputElement, sendButton) {
    this.chatContainer = chatContainer;
    this.inputElement = inputElement;
    this.sendButton = sendButton;
    this.config = CONFIG_CHATBOT;

    this.sendButton.addEventListener("click", () => this.handleSendMessage());
    this.inputElement.addEventListener("keypress", (event) => {
      if (event.key === "Enter") this.handleSendMessage();
    });

    // Check API health when initializing
    this.checkApiHealth();
  }

  async checkApiHealth() {
    try {
      const response = await fetch(
        `${this.config.BASE_URL}${this.config.API_ENDPOINTS.HEALTH_CHECK.URL}`
      );
      if (!response.ok) {
        console.error("API Health Check Failed:", response.status);
      }
    } catch (error) {
      console.error("API Health Check Error:", error);
    }
  }

  async handleSendMessage() {
    const message = this.inputElement.value.trim();
    if (!message) return;

    this.appendMessage("You", message);
    this.inputElement.value = "";

    try {
      const response = await this.sendMessageToBot(message);
      this.appendMessage("Bot", response);
    } catch (error) {
      console.error("Error:", error);
      this.appendMessage(
        "Bot",
        "Maaf, terjadi kesalahan dalam memproses pesan Anda."
      );
    }
  }

  async sendMessageToBot(message) {
    const url = `${this.config.BASE_URL}${this.config.API_ENDPOINTS.CHAT_ENDPOINT.URL}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "Maaf, saya belum mengerti pesan itu.";
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  appendMessage(sender, text) {
    // Buat wrapper untuk label dan bubble
    const wrapperElem = document.createElement("div");
    wrapperElem.style.display = "flex";
    wrapperElem.style.flexDirection = "column";
    wrapperElem.style.alignItems = sender === "You" ? "flex-end" : "flex-start";
    wrapperElem.style.marginBottom = "2px";

    // Buat elemen label sender di luar bubble
    const labelElem = document.createElement("div");
    labelElem.classList.add("chat-sender-label");
    labelElem.textContent = sender;

    // Buat elemen bubble pesan
    const messageElem = document.createElement("div");
    messageElem.classList.add(
      "chat-message",
      sender === "You" ? "user-message" : "bot-message"
    );
    messageElem.textContent = text;

    // Gabungkan label dan bubble ke wrapper
    wrapperElem.appendChild(labelElem);
    wrapperElem.appendChild(messageElem);

    this.chatContainer.appendChild(wrapperElem);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
}
