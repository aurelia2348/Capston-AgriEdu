export default class LoginPresenter {
  init(formElement) {
    this._form = formElement;

    this._emailInput = this._form.querySelector("#email");
    this._passwordInput = this._form.querySelector("#password");

    this._emailError = this._form.querySelector("#emailError");
    this._passwordError = this._form.querySelector("#passwordError");

    this._bindEvents();
  }

  _bindEvents() {
    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._handleSubmit();
    });

    // Realtime validation saat user mengetik
    this._emailInput.addEventListener("input", () => {
      this._validateEmail();
    });

    this._passwordInput.addEventListener("input", () => {
      this._validatePassword();
    });

    // toggle password button
    const toggleButtons = this._form.querySelectorAll(".toggle-password");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        const input = this._form.querySelector(`#${targetId}`);
        const icon = button.querySelector("i");

        if (input.type === "password") {
          input.type = "text";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        } else {
          input.type = "password";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        }
      });
    });
  }

  _handleSubmit() {
    // Reset error dulu
    this._emailError.textContent = "";
    this._passwordError.textContent = "";

    const isEmailValid = this._validateEmail();
    const isPasswordValid = this._validatePassword();

    if (isEmailValid && isPasswordValid) {
      const loginData = {
        email: this._emailInput.value.trim(),
        password: this._passwordInput.value.trim(),
      };
      console.log("Login submitted", loginData);
      // TODO: Kirim loginData ke backend API
    }
  }

  _validateEmail() {
    const email = this._emailInput.value.trim();

    if (!email) {
      this._emailError.textContent = "Email is required.";
      return false;
    } else if (!this._isValidEmail(email)) {
      this._emailError.textContent = "Invalid email format.";
      return false;
    } else {
      this._emailError.textContent = "";
      return true;
    }
  }

  _validatePassword() {
    const password = this._passwordInput.value.trim();

    if (!password) {
      this._passwordError.textContent = "Password is required.";
      return false;
    } else if (password.length < 8) {
      this._passwordError.textContent = "Password must be at least 8 characters.";
      return false;
    } else {
      this._passwordError.textContent = "";
      return true;
    }
  }

  _isValidEmail(email) {
    // Regex simple cek format email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}