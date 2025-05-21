import LoginPresenter from '../presenters/LoginPresenter.js';
import AuthService from '../services/AuthService.js';

export default class Login {
  constructor() {
    this.presenter = new LoginPresenter(this, new AuthService());
  }

  async render() {
    return `
      <link rel="stylesheet" href="Login.css">
      <section class="login-container">
        <div class="login-wrapper">
          <div class="login-left">
            <div class="logo">
              <h1><span class="src/public/images/Hero-Home (2).png">Agri</span><span class="logo-light">Edu</span></h1>
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
              <p class="error-text" id="login-error"></p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    document.querySelector('.toggle-password').addEventListener('click', () => {
      const input = document.getElementById('password');
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      this.presenter.handleLogin(email, password);
    });
  }

  showError(message) {
    const errorText = document.getElementById('login-error');
    errorText.textContent = message;
    errorText.style.color = 'red';
  }

  setLoading(isLoading) {
    const button = document.querySelector('.login-button');
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Logging in...' : 'Login';
  }

  navigateToDashboard() {
    window.location.href = '#/dashboard';
  }
}
