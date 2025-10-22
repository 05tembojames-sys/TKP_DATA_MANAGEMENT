import { createApp } from "vue";
import "./style.css";
import "@fortawesome/fontawesome-free/css/all.css";
import App from "./App.vue";
import router from "./router/index.js";

// Register PWA
if ("serviceWorker" in navigator) {
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
        console.log("Service Worker registration failed:", error);
        // This is expected in development mode
        if (import.meta.env.MODE === "development") {
          console.log(
            "Service Worker registration failure is expected in development mode"
          );
        }
      });
  });
}

const app = createApp(App);
app.use(router);
app.mount("#app");
