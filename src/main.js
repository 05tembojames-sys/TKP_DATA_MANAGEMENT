import { createApp } from "vue";
import "@fortawesome/fontawesome-free/css/all.css";
import App from "./App.vue";
import router from "./router/index.js";
import "./style.css";
import "./assets/dhis2-forms.css";

// Dev utilities - exposed to browser console
import { fixFormStatus, checkFormStatus } from "./utils/fixFormStatus.js";
window.fixFormStatus = fixFormStatus;
window.checkFormStatus = checkFormStatus;

// Register PWA (only in production)
if ("serviceWorker" in navigator && import.meta.env.MODE === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
} else if (import.meta.env.MODE === "development") {
  console.log("ℹ️ Service Worker disabled in development mode");

  // Unregister any existing service workers in development
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
        console.log("🗑️ Unregistered service worker");
      }
    });
  }
}

const app = createApp(App);
app.use(router);
app.mount("#app");
