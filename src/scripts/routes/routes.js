import Login from '../pages/login/LoginPage.js';
import LandingPresenter from '../pages/landing-page/LandingPage-Presenter.js';
import SetupPage from '../pages/setup/SetupPage.js';
import SetupPageStart from '../pages/setup/SetupPage-Start.js';
import Logout from '../pages/logout/LogoutPage.js';
import HomePage from '../pages/home/home-page.js';
import LearningPage from '../pages/learning/LearningPage.js';
import ChatbotPage from '../pages/chatbot/ChatBotPage.js';
import CommunityPage from '../pages/comunity/ComunityPage.js';
import Register from '../pages/register/RegisterPage.js';

const container = document.getElementById('app');

const routes = {
  '/login': new Login(),
  '/landing': new LandingPresenter(container),
  '/home': new HomePage(),
  '/setup': new SetupPage(),
  '/setupstart': new SetupPageStart(),
  '/logout': new Logout(),
  '/learning': new LearningPage(),
  '/chatbot': new ChatbotPage(),
  '/community': new CommunityPage(),
  '/register': new Register(),
};

export default routes;
