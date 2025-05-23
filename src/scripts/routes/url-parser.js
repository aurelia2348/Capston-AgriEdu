const UrlParser = {
  parseUrl(url) {
    const urlObj = new URL(url, window.location.origin);
    return {
      path: urlObj.pathname,
      query: this.parseQueryParams(urlObj.search),
      hash: urlObj.hash.substring(1),
    };
  },

  parseQueryParams(queryString) {
    const params = {};
    const searchParams = new URLSearchParams(queryString);

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    return params;
  },

  parseActiveUrlWithCombiner() {
    const hash = window.location.hash.substring(1) || "/";
    return this.parseUrlWithCombiner(hash);
  },

  parseUrlWithCombiner(url) {
    const normalizedUrl = url.startsWith("/") ? url.substring(1) : url;

    const splitUrl = normalizedUrl.split("/");

    const segments = splitUrl.filter((segment) => segment.length > 0);

    return segments.length > 0 ? `/${segments.join("/")}` : "/";
  },
};

export default UrlParser;
