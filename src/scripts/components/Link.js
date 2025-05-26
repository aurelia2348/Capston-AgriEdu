class Link {
  static create({ to, text, className = "", id = "", onClick = null }) {
    const link = document.createElement("a");
    link.href = `#${to.startsWith("/") ? to : `/${to}`}`;
    link.textContent = text;

    if (className) {
      link.className = className;
    }

    if (id) {
      link.id = id;
    }

    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey) {
        return;
      }

      event.preventDefault();

      window.location.hash = link.getAttribute("href").substring(1);

      if (onClick && typeof onClick === "function") {
        onClick(event);
      }
    });

    return link;
  }

  static updateLinks(container, router) {
    const links = container.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      const href = link.getAttribute("href");

      if (
        href === "#" ||
        href.startsWith("##") ||
        link.classList.contains("scroll-link")
      ) {
        return;
      }

      if (link.getAttribute("data-spa-handler")) {
        return;
      }

      link.setAttribute("data-spa-handler", "true");

      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey) {
          return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          event.preventDefault();

          if ("scrollBehavior" in document.documentElement.style) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            window.scrollTo(0, targetElement.offsetTop);
          }
        } else {
          event.preventDefault();

          const path = href.substring(1);

          router.navigate(path);
        }
      });
    });
  }
}

export default Link;
