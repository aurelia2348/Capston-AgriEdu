import authService from "../../data/auth-service.js";

export default class RegisterPresenter {
  init(form) {
    if (!form) return;

    // Add a general error message element
    const generalErrorEl = document.createElement("small");
    generalErrorEl.classList.add("error");
    generalErrorEl.setAttribute("id", "generalError");
    generalErrorEl.setAttribute("aria-live", "polite");
    form.querySelector("button[type='submit']").before(generalErrorEl);

    const setError = (id, message) => {
      const el = document.getElementById(id);
      if (el) el.textContent = message;
    };

    const validateField = (field, data) => {
      switch (field) {
        case "username":
          return data.username ? "" : "Username is required";
        case "email":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
            ? ""
            : "Invalid email format";
        case "password":
          return data.password.length >= 8
            ? ""
            : "Password must be at least 8 characters";
        case "confirmPassword":
          return data.password === data.confirmPassword
            ? ""
            : "Passwords do not match";
        default:
          return "";
      }
    };

    const validate = (data, focusedField = null) => {
      const fields = ["username", "email", "password", "confirmPassword"];
      fields.forEach((field) => {
        const errorMessage = validateField(field, data);
        if (focusedField === field) {
          setError(field + "Error", errorMessage);
        } else {
          setError(field + "Error", "");
        }
      });
    };

    form.addEventListener("input", (e) => {
      const data = this._getFormData(form);
      validate(data, e.target.id);
      setError("generalError", ""); // Clear general error on input
    });

    form.addEventListener("focusin", (e) => {
      const data = this._getFormData(form);
      validate(data, e.target.id);
    });

    form.addEventListener("focusout", (e) => {
      const data = this._getFormData(form);
      const errorMessage = validateField(e.target.id, data);
      setError(e.target.id + "Error", errorMessage);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Clear all error messages
      setError("generalError", "");

      // Disable the submit button to prevent multiple submissions
      const submitButton = form.querySelector("button[type='submit']");
      submitButton.disabled = true;
      submitButton.textContent = "Signing Up...";

      const data = this._getFormData(form);

      const fields = ["username", "email", "password", "confirmPassword"];
      fields.forEach((field) => {
        const errorMessage = validateField(field, data);
        setError(field + "Error", errorMessage);
      });

      const isValid =
        data.username &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
        data.password.length >= 8 &&
        data.password === data.confirmPassword;

      if (isValid) {
        try {
          const registrationData = {
            username: data.username,
            email: data.email,
            password: data.password,
          };

          await authService.register(registrationData);

          alert(
            "Registration successful! Please log in with your new account."
          );
          window.location.hash = "#/login";
        } catch (error) {
          setError(
            "generalError",
            error.message || "Registration failed. Please try again."
          );

          submitButton.disabled = false;
          submitButton.textContent = "Sign Up";
        }
      } else {
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
      }
    });

    this._initTogglePassword();
  }

  _getFormData(form) {
    return {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
    };
  }

  _initTogglePassword() {
    document.querySelectorAll(".toggle-password").forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        const input = document.getElementById(targetId);
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
}
