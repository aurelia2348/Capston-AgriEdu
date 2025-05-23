import LoginPresenter from './LoginPage-Presenter.js';

export default class Login {
  async render() {
  return `
<section class="container login-page">
  <div class="login-left">
    <img src="logo/Main-Logo-White.png" alt="AgriEdu Logo" class="logo-overlay" />
  </div>

  <!-- Right Side Form -->
  <div class="login-right">
    <div class="login-container">
      <h1>Log in</h1>
      <p class="login-subtitle">Hello, welcome to AgriEdu! Please Log in to continue your smart farming journey.</p>
      <form id="loginForm" novalidate>

        <label for="email" class="form-label">Email address</label>
        <input type="email" id="email" placeholder="Enter your email" required aria-describedby="emailError" />
        <small class="error" id="emailError" aria-live="polite"></small>

        <label for="password" class="form-label">Password</label>
        <div class="password-wrapper">
          <input type="password" id="password" placeholder="Enter your password" required aria-describedby="passwordError" />
          <button type="button" class="toggle-password" data-target="password" aria-label="Toggle password visibility">
            <i class="fa-solid fa-eye-slash"></i>
          </button>
        </div>
        <small class="error" id="passwordError" aria-live="polite"></small>

        <div class="forgot-password">
          <a href="#forgot">Forgot password?</a>
        </div>

        <button type="submit">Login</button>
      </form>
      <p class="register-link">Don't have an account? <a href="#/register" id="toRegister">Register here</a></p>
    </div>
  </div>
</section>
  `;
}


  async afterRender() {
    const presenter = new LoginPresenter();
    presenter.init(document.querySelector("#loginForm"));
  }
}
