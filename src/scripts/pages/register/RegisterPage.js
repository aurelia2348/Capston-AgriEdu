import RegisterPresenter from './RegisterPage-Presenter.js';

export default class RegisterPage {
  async render() {
return `
<section class="container">
  <div class="register-container">
    <h1>Sign Up</h1>
    <p class="register-subtitle">Create your account and start your journey towards smarter, sustainable farming.</p>
    <form id="registerForm" novalidate>

      <label for="username" class="form-label">Username</label>
      <input type="text" id="username" placeholder="Create your username" required aria-describedby="usernameError" />
      <small class="error" id="usernameError" aria-live="polite"></small>

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
      <label for="confirmPassword" class="form-label">Confirm password</label>
<div class="password-wrapper">
  <input type="password" id="confirmPassword" placeholder="Confirm your Password" required aria-describedby="confirmPasswordError" />
  <button type="button" class="toggle-password" data-target="confirmPassword" aria-label="Toggle password visibility">
    <i class="fa-solid fa-eye-slash"></i>
  </button>
</div>
<small class="error" id="confirmPasswordError" aria-live="polite"></small>

      <button type="submit">Sign Up</button>
    </form>
    <p class="login-link">Already have an account? <a href="#/login" id="toLogin">Login here</a></p>
  </div>
</section>

`;

  }

  async afterRender() {
    const presenter = new RegisterPresenter();
    presenter.init(document.querySelector("#registerForm"));
  }
}
