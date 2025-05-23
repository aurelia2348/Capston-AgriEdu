/**
 * Link component for SPA navigation
 * Creates anchor elements that use the router for navigation
 */
class Link {
  /**
   * Create a link element
   * @param {Object} options - Link options
   * @param {string} options.to - The path to navigate to
   * @param {string} options.text - The link text
   * @param {string} options.className - CSS class(es) for the link
   * @param {string} options.id - ID for the link element
   * @param {Function} options.onClick - Additional click handler
   * @returns {HTMLAnchorElement} - The created anchor element
   */
  static create({ to, text, className = '', id = '', onClick = null }) {
    const link = document.createElement('a');
    link.href = `#${to.startsWith('/') ? to : `/${to}`}`;
    link.textContent = text;

    if (className) {
      link.className = className;
    }

    if (id) {
      link.id = id;
    }

    // Prevent default behavior and use router navigation
    link.addEventListener('click', (event) => {
      // Allow opening in new tab with Ctrl/Cmd+click
      if (event.ctrlKey || event.metaKey) {
        return;
      }

      event.preventDefault();

      // Update URL hash
      window.location.hash = link.getAttribute('href').substring(1);

      // Call additional click handler if provided
      if (onClick && typeof onClick === 'function') {
        onClick(event);
      }
    });

    return link;
  }

  /**
   * Update all links in a container to use SPA navigation
   * @param {HTMLElement} container - The container element
   * @param {Function} router - The router instance
   */
  static updateLinks(container, router) {
    const links = container.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      const href = link.getAttribute('href');

      // Skip if it's an anchor link within the same page or has the scroll-link class
      if (href === '#' || href.startsWith('##') || link.classList.contains('scroll-link')) {
        return;
      }

      // Skip if it already has a click event listener for SPA navigation
      if (link.getAttribute('data-spa-handler')) {
        return;
      }

      // Mark this link as having an SPA handler
      link.setAttribute('data-spa-handler', 'true');

      link.addEventListener('click', (event) => {
        // Allow opening in new tab with Ctrl/Cmd+click
        if (event.ctrlKey || event.metaKey) {
          return;
        }

        // Check if this is an in-page link (points to an element ID on the same page)
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // This is an in-page link, handle it with smooth scrolling
          event.preventDefault();

          // Scroll to the element
          if ('scrollBehavior' in document.documentElement.style) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          } else {
            // Simple scroll for browsers that don't support smooth scrolling
            window.scrollTo(0, targetElement.offsetTop);
          }
        } else {
          // This is a navigation link, handle it with the router
          event.preventDefault();

          // Get the path from the href
          const path = href.substring(1);

          // Navigate using the router
          router.navigate(path);
        }
      });
    });
  }
}

export default Link;
