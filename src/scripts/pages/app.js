import routes from '../routes/routes.js';

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;
    window.addEventListener('hashchange', () => this.renderPage());
  }

  _getInitialPage() {
    return window.location.hash.slice(1).toLowerCase() || 'landing';
  }

  async renderPage() {
    const page = this._getInitialPage();
    const pageInstance = routes[`/${page}`];

    if (this.content && pageInstance) {
      console.log('Rendering page:', page);
      this.content.innerHTML = await pageInstance.render();
      await pageInstance.afterRender?.();
    } else {
      console.error('Page not found or content element missing');
    }
  }
}

export default App; 
