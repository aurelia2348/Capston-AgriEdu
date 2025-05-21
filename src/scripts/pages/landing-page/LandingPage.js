export class LandingPage {
  constructor(container) {
    this.container = container;
  }

  async render(services) {
    this.container.innerHTML = `
      <header class="hero-section">
        <nav class="navbar">
          <img src="logo/Main-Logo-White.png" alt="agriedu" class="logo" />
          <div class="nav-right">
            <ul class="nav-links">
              <li><a href="#ourServices">Our Service</a></li>
              <li><a href="#aboutUs">About Us</a></li>
              <li><a href="#signUp-login">SignUp/Login</a></li>
            </ul>
            <form><input type="text" placeholder="Search your word" /></form>
          </div>
        </nav>
        <div class="hero-content">
          <h1>Empowering Farmers with <span>Knowledge</span> and <span>Innovation</span></h1>
          <p>AgriEdu provides you with the tools and expertise to transform your farming practices.</p>
          <button>Get Started</button>
        </div>
      </header>
      <section class="tagline">
        <div>Sustainable</div><div>Innovative</div><div>Empowering</div>
        <div>Smart</div><div>Eco-friendly</div><div>Educational</div>
      </section>
      <section id="aboutUs" class="about">
        <div class="about-images">
          <img src="images/About-LandingPage.jpg" />
          <img src="images/About-LandingPage2.jpg" />
          <img src="images/About-LandingPage3.jpg" />
        </div>
        <div class="about-text">
          <h3>About Us</h3>
          <h2>What is AgriEdu?</h2>
          <p><strong>Modern & Accessible Farming Education</strong><br />AgriEdu gives access to online courses, tutorials, and community support focused on sustainable practices.</p>
          <p><strong>Smart Farming with AI-powered Tools</strong><br />Use AI-based tools to detect plant diseases and boost productivity.</p>
        </div>
      </section>
      <hr class="short-line" />
      <section id="ourServices" class="services">
        <h3>Our Services</h3>
        <h2>Farming Made Smarter with AgriEdu</h2>
        <div class="service-grid">
          ${services
            .map(
              (service) => `
            <div class="card">
              <img src="${service.icon}" class="img-placeholder small" />
              <h4>${service.title}</h4>
              <p>${service.description}</p>
              <img src="${service.image}" class="card-image" />
            </div>
          `
            )
            .join("")}
        </div>
      </section>
      <footer id="signUp-login" class="main-footer">
        <div class="cta-text">
          <h2>Ready to Grow Smarter?</h2>
          <p>Join AgriEdu today and start your journey toward sustainable farming.</p>
          <div class="cta-buttons">
            <button>Login</button>
            <button class="outline">SignUp</button>
          </div>
        </div>
      </footer>
      <div class="footer-bottom">
        <p>© 2025 AgriEdu. All rights reserved.</p>
      </div>
    `;
  }
}
