import "../styles/styles.css";
import Swal from "sweetalert2";

import App from "./pages/app";

// Make SweetAlert2 globally available
window.Swal = Swal;

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
