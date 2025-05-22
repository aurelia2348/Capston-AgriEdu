export default class SetupPageStart {
  async render() {
    return `
      <section class="setup-wrapper">
        <div class="setup-card">
          <div class="icon" id="step-icon">🌱</div>
          <h2 class="title" id="step-title">
            Let’s <span class="green">get</span> your <br /><strong>set up first!</strong>
          </h2>
          <p class="desc" id="step-desc">
            Just a few steps to create your AgriEdu account and start exploring smarter farming tools and learning resources.
          </p>
          <div class="dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <button id="next-btn">next</button>
        </div>
      </section>
    `;
  }

  async afterRender() {
    import('./SetupPage-Presenter.js').then((module) => {
      const presenter = new module.default();
      presenter.init();
    });
  }
}
