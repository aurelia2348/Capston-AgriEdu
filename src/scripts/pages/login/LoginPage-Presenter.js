export default class LoginPresenter {
  constructor(view, authService) {
    this.view = view;
    this.authService = authService;
  }

  async handleLogin(email, password) {
    if (!email || !password) {
      this.view.showError('Email and password are required.');
      return;
    }

    try {
      this.view.setLoading(true);
      const result = await this.authService.login(email, password);
      this.view.setLoading(false);

      if (result.success) {
        this.view.navigateToDashboard();
      } else {
        this.view.showError(result.message || 'Login failed.');
      }
    } catch (error) {
      this.view.setLoading(false);
      this.view.showError('An error occurred during login.');
      console.error(error);
    }
  }
}
