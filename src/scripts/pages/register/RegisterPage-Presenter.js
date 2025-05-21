export default class RegisterPresenter {
  init(form) {
    if (!form) return;

    const setError = (id, message) => {
      const el = document.getElementById(id);
      if (el) el.textContent = message;
    };

    const validateField = (field, data) => {
      switch (field) {
        case "username":
          return data.username ? "" : "Username is required";
        case "email":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? "" : "Invalid email format";
        case "password":
          return data.password.length >= 8 ? "" : "Password must be at least 8 characters";
        case "confirmPassword":
          return data.password === data.confirmPassword ? "" : "Passwords do not match";
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

    form.addEventListener("submit", (e) => {
      e.preventDefault();

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
        alert("Registered successfully! (API integration coming soon)");
        window.location.hash = "#/login";
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
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = button.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text'; // bikin kelihatan
        icon.classList.remove('fa-eye-slash'); // ganti jadi mata tertutup
        icon.classList.add('fa-eye');
      } else {
        input.type = 'password'; // sembunyikan lagi
        icon.classList.remove('fa-eye'); // ganti jadi mata terbuka
        icon.classList.add('fa-eye-slash');
      }
    });
  });
}

}