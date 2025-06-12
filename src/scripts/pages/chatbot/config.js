const CONFIG_CHATBOT = {
  BASE_URL: "https://chatbot-agriedu-production-aa60.up.railway.app",
  API_ENDPOINTS: {
    CHAT_ENDPOINT: {
      URL: "/api/v1/chat",
    },
    HEALTH_CHECK: {
      URL: "/api/v1/health",
    },
    INTENTS: {
      URL: "/api/v1/intents",
    },
    STATUS: {
      URL: "/",
    },
  },
};

export default CONFIG_CHATBOT;
