import Link from "./Link.js";

class Navigation {
  constructor({ container, router, items = [] }) {
    this.container = container;
    this.router = router;
    this.items = items;
    this.element = null;
  }

  render() {
    this.element = document.createElement("ul");
    this.element.className = "nav-links";

    this.items.forEach((item) => {
      const li = document.createElement("li");

      const link = Link.create({
        to: item.path,
        text: item.text,
        className: item.className || "",
        onClick: item.onClick || null,
      });

      if (
        window.location.hash.slice(1) === item.path ||
        window.location.hash.slice(1) === item.path.substring(1)
      ) {
        link.classList.add("active");
      }

      li.appendChild(link);
      this.element.appendChild(li);
    });

    if (this.container) {
      this.container.innerHTML = "";
      this.container.appendChild(this.element);
    }

    return this.element;
  }

  updateActiveLink(path) {
    if (!this.element) return;

    const links = this.element.querySelectorAll("a");
    links.forEach((link) => link.classList.remove("active"));

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const activeLink = this.element.querySelector(
      `a[href="#${normalizedPath}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }
}

export default Navigation;
