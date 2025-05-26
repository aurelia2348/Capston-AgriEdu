import authService from "../data/auth-service.js";

class RouteGuard {
  static requiresAuth(path) {
    const protectedRoutes = [
      "/home",
      "/learning",
      "/chatbot",
      "/community",
      "/account",
      "/profile",
      "/logout",
    ];

    return protectedRoutes.some(
      (route) => path === route || path.startsWith(`${route}/`)
    );
  }

  static isAuthenticated() {
    return authService.isAuthenticated();
  }

  static canActivate(path) {
    if (this.requiresAuth(path)) {
      return this.isAuthenticated();
    }

    return true;
  }

  static getAuthRedirectPath() {
    return "#/login";
  }
}

export default RouteGuard;
