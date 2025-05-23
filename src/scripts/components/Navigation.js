import Link from './Link.js';

/**
 * Navigation component for the application
 * Creates a navigation menu with links that use the router for navigation
 */
class Navigation {
  /**
   * Create a navigation component
   * @param {Object} options - Navigation options
   * @param {HTMLElement} options.container - The container element for the navigation
   * @param {Object} options.router - The router instance
   * @param {Array} options.items - Navigation items
   */
  constructor({ container, router, items = [] }) {
    this.container = container;
    this.router = router;
    this.items = items;
    this.element = null;
  }

  /**
   * Render the navigation component
   */
  render() {
    // Create navigation element
    this.element = document.createElement('ul');
    this.element.className = 'nav-links';
    
    // Add navigation items
    this.items.forEach(item => {
      const li = document.createElement('li');
      
      // Create link using the Link component
      const link = Link.create({
        to: item.path,
        text: item.text,
        className: item.className || '',
        onClick: item.onClick || null
      });
      
      // Add active class if this is the current route
      if (window.location.hash.slice(1) === item.path || 
          window.location.hash.slice(1) === item.path.substring(1)) {
        link.classList.add('active');
      }
      
      li.appendChild(link);
      this.element.appendChild(li);
    });
    
    // Add the navigation to the container
    if (this.container) {
      this.container.innerHTML = '';
      this.container.appendChild(this.element);
    }
    
    return this.element;
  }

  /**
   * Update the active link based on the current route
   * @param {string} path - The current route path
   */
  updateActiveLink(path) {
    if (!this.element) return;
    
    // Remove active class from all links
    const links = this.element.querySelectorAll('a');
    links.forEach(link => link.classList.remove('active'));
    
    // Add active class to the current route link
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const activeLink = this.element.querySelector(`a[href="#${normalizedPath}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

export default Navigation;
