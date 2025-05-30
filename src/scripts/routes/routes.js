import Login from "../pages/login/LoginPage.js";
import LandingPresenter from "../pages/landing-page/LandingPage-Presenter.js";
import Logout from "../pages/logout/LogoutPage.js";
import HomePage from "../pages/home/home-page.js";
import LearningPage from "../pages/learning/LearningPage.js";
import ChatbotPage from "../pages/chatbot/ChatBotPage.js";
import CommunityPage from "../pages/comunity/ComunityPage.js";
import CommunityPagePresenter from "../pages/comunity/ComunityPage-Presenter.js";
import Register from "../pages/register/RegisterPage.js";
import SetupPageStart from "../pages/setup/SetupPage-Start.js";
import ProfilePage from "../pages/profile/profile-page.js";
import DiagnosePage from "../pages/diagnose/DiagnosePage.js";
import DiagnoseForm from "../pages/diagnose/DiagnoseForm.js";

const getRoutes = (mainContent) => {
  return {
    "/login": new Login(),
    "/landing": new LandingPresenter(mainContent),
    "/home": new HomePage(),
    "/logout": new Logout(),
    "/learning": new LearningPage(),
    "/chatbot": new ChatbotPage(),
    "/community": new CommunityPage(),
    "/register": new Register(),
    "/setup": new SetupPageStart(),
    "/profile": new ProfilePage(),
    "/form": new CommunityPagePresenter(),
    "/diagnosis": new DiagnosePage(),
    "/diagnosisForm": new DiagnoseForm(),

    "/": {
      render: () => {
        window.location.hash = "/landing";
        return "<div>Redirecting...</div>";
      },
    },
  };
};

export default getRoutes;
