import "../styles/styles.css";

import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const app = new App({
      content: document.querySelector("#main-content"),
      drawerButton: document.querySelector("#drawer-button"),
      navigationDrawer: document.querySelector("#navigation-drawer"),
    });

    await app.init();
  } catch (error) {
    console.error("Error initializing app:", error);
  }
});
