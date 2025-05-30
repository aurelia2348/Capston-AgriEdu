import RouteGuard from "./route-guard.js";

class Router {
  constructor() {
    this.routes = {};
    this.currentPath = "";
    this.beforeRouteCallback = null;
    this.afterRouteCallback = null;
    this.notFoundCallback = null;
  }

  registerRoutes(routes) {
    this.routes = routes;
    return this;
  }

  beforeRoute(callback) {
    this.beforeRouteCallback = callback;
    return this;
  }

  afterRoute(callback) {
    this.afterRouteCallback = callback;
    return this;
  }

  setNotFoundCallback(callback) {
    this.notFoundCallback = callback;
    return this;
  }

  start() {
    window.addEventListener("hashchange", () => {
      this.handleRouteChange();
    });

    this.handleRouteChange();

    return this;
  }

  handleRouteChange() {
    const path = this.getPathFromHash();

    if (path === this.currentPath) {
      return;
    }

    this.currentPath = path;

    if (RouteGuard.requiresAuth(path) && !RouteGuard.isAuthenticated()) {
      console.log(
        `Route ${path} requires authentication. Redirecting to login.`
      );
      window.location.hash = RouteGuard.getAuthRedirectPath().substring(1);
      return;
    }

    if (this.beforeRouteCallback && !this.beforeRouteCallback(path)) {
      return;
    }

    const pageInstance = this.routes[path];

    if (pageInstance) {
      if (this.afterRouteCallback) {
        this.afterRouteCallback(path, pageInstance);
      }
    } else {
      if (this.notFoundCallback) {
        this.notFoundCallback(path);
      }
    }
  }

  getPathFromHash() {
    const hash = window.location.hash.substring(1);

    const pathWithoutQuery = hash.split("?")[0];

    return pathWithoutQuery || "/";
  }

  navigate(path) {
    window.location.hash = path;
  }

  scrollToElement(element, updateUrl = false) {
    if (!element) return;

    if ("scrollBehavior" in document.documentElement.style) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      this.smoothScrollPolyfill(element);
    }

    if (updateUrl && element.id) {
      history.pushState(null, null, `#${element.id}`);
    }
  }

  smoothScrollPolyfill(element) {
    const targetPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500; // ms
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
}

export default Router;
