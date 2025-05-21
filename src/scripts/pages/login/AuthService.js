export default class AuthService {
  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    if (email === 'admin@example.com' && password === 'password') {
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password.' };
    }
  }
}
