const CONFIG = {
  BASE_URL: "http://localhost:5000",
  API_ENDPOINTS: {
    AUTH: {
      REGISTER: "/api/auth/register",
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/auth/logout",
      GET_USER: "/api/auth/user",
      REFRESH_TOKEN: "/api/auth/refresh",
    },
    POSTS: {
      GET_ALL: "/api/posts",
      GET_BY_ID: "/api/posts/",
      CREATE: "/api/posts",
      UPDATE: "/api/posts/",
      DELETE: "/api/posts/",
    },
    COMMENTS: {
      GET_ALL: "/api/posts/",
      CREATE: "/api/posts/",
      UPDATE: "/api/posts/",
      DELETE: "/api/posts/",
    },
    ACCOUNT: {
      GET: "/api/account",
      UPDATE: "/api/account",
      DELETE: "/api/account",
    },
  },
  STORAGE_KEYS: {
    AUTH_TOKEN: "agriedu_auth_token",
    REFRESH_TOKEN: "agriedu_refresh_token",
    USER_DATA: "agriedu_user_data",
  },
};

export default CONFIG;
