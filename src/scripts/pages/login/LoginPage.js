export default class Login {
  async render() {
    return `
      <section class="container">
        <h1>Login</h1>
      </section>
    `;
  }

  async afterRender() {
    export default class Login {
  async render() {
    return `
      <section class="login-container">
        <div class="login-wrapper">
          <div class="login-left">
            <img src="your-image-path.jpg" alt="Farming Image" class="login-image" />
            <div class="logo">
              <h1><span class="src/public/logo/Main-Logo-White.png">Agri</span><span class="logo-light">Edu</span></h1>
            </div>
          </div>
          <div class="login-right">
            <div class="login-box">
              <h2>Log in</h2>
              <p>Hello, welcome to AgriEdu! Please log in to continue your smart farming journey.</p>
              <form id="login-form">
                <label for="email">Email address</label>
                <input type="email" id="email" placeholder="Enter your email" required />
                
                <label for="password">Password</label>
                <div class="password-field">
                  <input type="password" id="password" placeholder="Enter your password" required />
                  <span class="toggle-password">👁️</span>
                </div>
                
                <a href="#/forgot-password" class="forgot-link">Forgot password?</a>
                
                <button type="submit" class="login-button">Login</button>
              </form>
              <p class="register-text">Don't have an account? <a href="#/register">Register here</a></p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
    });

    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      // You can add your login logic here
      console.log('Logging in with:', email, password);
    });
  }
    }
  }
}
