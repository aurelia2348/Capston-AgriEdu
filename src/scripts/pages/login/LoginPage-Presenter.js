import authService from "../../data/auth-service.js";

export default class LoginPresenter {
  init(formElement) {
    this._form = formElement;

    this._emailInput = this._form.querySelector("#email");
    this._passwordInput = this._form.querySelector("#password");

    this._emailError = this._form.querySelector("#emailError");
    this._passwordError = this._form.querySelector("#passwordError");

    this._generalError = document.createElement("small");
    this._generalError.classList.add("error");
    this._generalError.setAttribute("id", "generalError");
    this._generalError.setAttribute("aria-live", "polite");
    this._form
      .querySelector("button[type='submit']")
      .before(this._generalError);

    this._bindEvents();
    if (authService.isAuthenticated()) {
      window.location.hash = "#/home";
    }
  }

  _bindEvents() {
    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._handleSubmit();
    });

    this._emailInput.addEventListener("input", () => {
      this._validateEmail();
      this._generalError.textContent = "";
    });

    this._passwordInput.addEventListener("input", () => {
      this._validatePassword();
      this._generalError.textContent = "";
    });

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

  async _handleSubmit() {
    this._emailError.textContent = "";
    this._passwordError.textContent = "";
    this._generalError.textContent = "";

    const submitButton = this._form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    const isEmailValid = this._validateEmail();
    const isPasswordValid = this._validatePassword();

    if (isEmailValid && isPasswordValid) {
      const loginData = {
        email: this._emailInput.value.trim(),
        password: this._passwordInput.value.trim(),
      };

      try {
        const response = await authService.login(loginData);

        Swal.fire({
          icon: "success",
          title: "Selamat datang!",
          text: "Login berhasil! Selamat datang kembali di AgriEdu.",
          showConfirmButton: false,
          timer: 3000,
        });

        setTimeout(async () => {
          try {
            const userData = response.user || response;
            const userId = userData.id;

            if (userId) {
              const { hasCompletedSetup } = await import(
                "../../utils/indexeddb"
              );
              const setupCompleted = await hasCompletedSetup(userId);

              if (setupCompleted) {
                window.location.hash = "#/home";
              } else {
                window.location.hash = "#/setup";
              }
            } else {
              window.location.hash = "#/setup";
            }
          } catch (error) {
            window.location.hash = "#/setup";
          }
        }, 1000);
      } catch (error) {
        this._generalError.textContent =
          error.message ||
          "Login failed. Please check your credentials and try again.";

        submitButton.disabled = false;
        submitButton.textContent = "Login";
      }
    } else {
      submitButton.disabled = false;
      submitButton.textContent = "Login";
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
      this._passwordError.textContent =
        "Password must be at least 8 characters.";
      return false;
    } else {
      this._passwordError.textContent = "";
      return true;
    }
  }

  _isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
