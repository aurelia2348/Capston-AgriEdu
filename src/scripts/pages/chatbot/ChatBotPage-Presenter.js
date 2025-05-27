export default class ChatbotPresenter {
  constructor(chatContainer, inputElement, sendButton) {
    this.chatContainer = chatContainer;
    this.inputElement = inputElement;
    this.sendButton = sendButton;

    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.inputElement.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') this.handleSendMessage();
    });
  }

  handleSendMessage() {
    const message = this.inputElement.value.trim();
    if (!message) return;

    this.appendMessage('You', message);
    this.inputElement.value = '';

    // Simulasi balasan chatbot statis
    const reply = this.generateBotReply(message);
    setTimeout(() => {
      this.appendMessage('Bot', reply);
    }, 500); // delay 500ms biar kayak balasan nyata
  }

  generateBotReply(message) {
    const msg = message.toLowerCase();
    if (msg.includes('halo')) return 'Halo juga! Ada yang bisa saya bantu?';
    if (msg.includes('siapa kamu')) return 'Saya adalah chatbot sederhana.';
    if (msg.includes('terima kasih')) return 'Sama-sama! Senang bisa membantu.';
    return "Maaf, saya belum mengerti pesan itu.";
  }

  appendMessage(sender, text) {
    const messageElem = document.createElement('div');
    messageElem.classList.add('chat-message', sender === 'You' ? 'user-message' : 'bot-message');
    messageElem.textContent = `${sender}: ${text}`;
    this.chatContainer.appendChild(messageElem);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
}
