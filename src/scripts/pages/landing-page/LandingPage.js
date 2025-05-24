export class LandingPage {
  constructor(container) {
    this.container = container;
  }

  async render(services) {
    const serviceItems = Array.isArray(services) ? services : [];

    return `
      <header class="hero-section">
        <nav class="navbar">
          <img src="logo/Main-Logo-White.png" alt="agriedu" class="logo" id="logo-home" />
          <div class="hamburger-menu">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
          <div class="nav-right">
            <ul class="nav-links">
              <li><a href="#ourServices" class="scroll-link">Our Service</a></li>
              <li><a href="#aboutUs" class="scroll-link">About Us</a></li>
              <li><a href="#signUp-login" class="scroll-link">Sign Up/Login</a></li>
            </ul>
            <form class="search-form"><input type="text" placeholder="Search your word" /></form>
          </div>
        </nav>
        <div class="hero-content">
          <h1>Empowering Farmers with <span>Knowledge</span> and <span>Innovation</span></h1>
          <p>AgriEdu provides you with the tools and expertise to transform your farming practices.</p>
          <button id="get-started-btn">Get Started</button>
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
          ${
            serviceItems.length > 0
              ? serviceItems
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
                  .join("")
              : '<div class="no-services">No services available</div>'
          }
        </div>
      </section>
      <footer id="signUp-login" class="main-footer">
        <div class="cta-text">
          <h2>Ready to Grow Smarter?</h2>
          <p>Join AgriEdu today and start your journey toward sustainable farming.</p>
          <div class="cta-buttons">
            <button onclick="window.location.hash = '/login'">Login</button>
            <button onclick="window.location.hash = '/register'" class="outline">SignUp</button>
          </div>
        </div>
      </footer>
      <div class="footer-bottom">
        <p>© 2025 AgriEdu. All rights reserved.</p>
      </div>
    `;
  }

  async afterRender() {
    const logo = document.querySelector("#logo-home");
    if (logo) {
      logo.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.hash = "/home";
      });
    }

    const getStartedBtn = document.querySelector("#get-started-btn");
    if (getStartedBtn) {
      getStartedBtn.addEventListener("click", () => {
        const targetElement = document.getElementById("signUp-login");
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }

    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const navRight = document.querySelector(".nav-right");

    if (hamburgerMenu) {
      hamburgerMenu.addEventListener("click", () => {
        hamburgerMenu.classList.toggle("active");
        navRight.classList.toggle("active");
      });

      const navLinks = document.querySelectorAll(".nav-links li a");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          hamburgerMenu.classList.remove("active");
          navRight.classList.remove("active");
        });
      });
    }

    this.setupSmoothScrolling();
    this.setupSearchFunctionality();

    const loginBtn = document.querySelector(".cta-buttons .btn:not(.outline)");
    if (loginBtn) {
      loginBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.hash = "/login";
      });
    }

    const registerBtn = document.querySelector(".cta-buttons .btn.outline");
    if (registerBtn) {
      registerBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.hash = "/register";
      });
    }
  }

  setupSmoothScrolling() {
    console.log("Setting up smooth scrolling for landing page");
    const scrollLinks = document.querySelectorAll(".scroll-link");
    console.log(`Found ${scrollLinks.length} scroll links`);

    scrollLinks.forEach((link, index) => {
      console.log(
        `Setting up scroll link ${index + 1}: ${link.getAttribute("href")}`
      );

      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      newLink.addEventListener("click", (event) => {
        console.log(`Scroll link clicked: ${newLink.getAttribute("href")}`);
        event.preventDefault();

        const targetId = newLink.getAttribute("href").substring(1);
        console.log(`Target ID: ${targetId}`);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          console.log(`Found target element, scrolling to it`);
          if ("scrollBehavior" in document.documentElement.style) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            this.smoothScrollPolyfill(targetElement);
          }
        } else {
          console.error(`Target element with ID "${targetId}" not found`);
        }
      });
    });

    if (
      window.location.hash &&
      window.location.hash.startsWith("#") &&
      !window.location.hash.startsWith("#/")
    ) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }

  smoothScrollPolyfill(targetElement) {
    const startPosition = window.pageYOffset;
    const targetPosition =
      targetElement.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let startTime = null;

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const scrollY = easeInOutQuad(
        timeElapsed,
        startPosition,
        distance,
        duration
      );
      window.scrollTo(0, scrollY);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  setupSearchFunctionality() {
    const searchForm = document.querySelector(".search-form");
    const searchInput = document.querySelector(".search-form input");

    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.performSearch(searchInput.value.trim());
      });

      searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.performSearch(searchInput.value.trim());
        }
      });

      searchInput.addEventListener("input", (event) => {
        const query = event.target.value.trim();
        if (query.length > 2) {
          this.highlightSearchResults(query);
        } else {
          this.clearSearchHighlights();
        }
      });
    }
  }

  performSearch(query) {
    if (!query) {
      alert("Please enter a search term");
      return;
    }

    console.log(`Searching for: ${query}`);

    const serviceCards = document.querySelectorAll(".card");
    let foundResults = false;

    serviceCards.forEach((card) => {
      const title = card.querySelector("h4")?.textContent.toLowerCase() || "";
      const description =
        card.querySelector("p")?.textContent.toLowerCase() || "";

      if (
        title.includes(query.toLowerCase()) ||
        description.includes(query.toLowerCase())
      ) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.style.border = "2px solid #7ac142";
        card.style.transform = "scale(1.02)";
        foundResults = true;

        setTimeout(() => {
          card.style.border = "";
          card.style.transform = "";
        }, 3000);

        return;
      }
    });

    if (!foundResults) {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const content = section.textContent.toLowerCase();
        if (content.includes(query.toLowerCase())) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          foundResults = true;
          return;
        }
      });
    }

    if (!foundResults) {
      alert(
        `No results found for "${query}". Try searching for terms like "learning", "community", "diagnosis", or "AI".`
      );
    }
  }

  highlightSearchResults(query) {
    console.log(`Live search for: ${query}`);
  }

  clearSearchHighlights() {
    const highlightedCards = document.querySelectorAll(
      ".card[style*='border']"
    );
    highlightedCards.forEach((card) => {
      card.style.border = "";
      card.style.transform = "";
    });
  }
}
