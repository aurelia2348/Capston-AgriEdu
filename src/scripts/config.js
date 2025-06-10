const CONFIG = {
  BASE_URL: "https://agriedu-production.up.railway.app",
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
      GET_ALL: "/api/posts/{postId}/comments",
      CREATE: "/api/posts/{postId}/comments",
      UPDATE: "/api/posts/{postId}/comments/{commentId}",
      DELETE: "/api/posts/{postId}/comments/{commentId}",
    },
    ACCOUNT: {
      GET: "/api/account",
      UPDATE: "/api/account",
      DELETE: "/api/account",
      UPLOAD_PROFILE_PICTURE: "/api/account/profile-picture",
      GET_PROFILE_PICTURE: "/api/account/profile-picture",
      DELETE_PROFILE_PICTURE: "/api/account/profile-picture",
    },
    LEARNING: {
      GET_ALL: "/api/learning",
      GET_BY_ID: "/api/learning/",
      CREATE: "/api/learning",
      UPDATE: "/api/learning/",
      DELETE: "/api/learning/",
      BOOKMARK: "/api/learning/",
      MARK_AS_READ: "/api/learning/",
    },
  },
  STORAGE_KEYS: {
    AUTH_TOKEN: "agriedu_auth_token",
    REFRESH_TOKEN: "agriedu_refresh_token",
    USER_DATA: "agriedu_user_data",
  },
};

export default CONFIG;
