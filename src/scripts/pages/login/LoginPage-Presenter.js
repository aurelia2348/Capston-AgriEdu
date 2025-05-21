export default class LoginPresenter {
  constructor(view, authService) {
    this.view = view;
    this.authService = authService;
  }

  async handleLogin(email, password) {
    if (!email || !password) {
      this.view.showError('Email and password tidak boleh kosong.');
      return;
    }

    this.view.setLoading(true);

    try {
      const result = await this.authService.login(email, password);
      this.view.setLoading(false);

      if (result.success) {
        this.view.navigateToDashboard();
      } else {
        this.view.showError(result.message || 'Login Gagal.');
      }
    } catch (error) {
      this.view.setLoading(false);
      this.view.showError('An unexpected error occurred.');
      console.error(error);
    }
  }
}
