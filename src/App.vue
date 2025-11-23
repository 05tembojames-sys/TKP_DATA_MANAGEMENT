<script setup>
import { onMounted } from "vue";
import AuthService from "./services/auth.js";
import { useRouter } from "vue-router";
import Toast from "./components/Toast.vue";

const router = useRouter();

onMounted(async () => {
  try {
    // Check if admin exists in Firestore
    const adminExists = await AuthService.checkAdminExists();
    
    // If we can't determine if admin exists (due to permissions), check if we're already on the setup page
    if (adminExists === null) {
      if (router.currentRoute.value.path === "/setup-admin") {
        // If we're already on the setup page, stay there
        return;
      }
      // Otherwise, assume admin exists to prevent lockout
      console.warn('Could not verify admin status. Proceeding with the assumption that an admin exists.');
    } else if (!adminExists && router.currentRoute.value.path !== "/setup-admin") {
      // If we're sure no admin exists, go to setup
      router.push("/setup-admin");
      return;
    }
  } catch (error) {
    console.error('Error in onMounted admin check:', error);
    // Continue with the rest of the code even if there's an error
  }

  // Listen to auth changes
  AuthService.onAuthStateChange((user, isAuthenticated) => {
    const savedAuthState = localStorage.getItem("tkp_auth_state");
    const isOfflineAuthenticated =
      savedAuthState === "authenticated" && !navigator.onLine;

    // If admin exists, handle normal auth navigation
    if (
      (isAuthenticated || isOfflineAuthenticated) &&
      router.currentRoute.value.path === "/login"
    ) {
      router.push("/dashboard");
    } else if (
      !isAuthenticated &&
      !isOfflineAuthenticated &&
      router.currentRoute.value.path === "/dashboard"
    ) {
      router.push("/login");
    }
  });
});
</script>

<template>
  <router-view />
  <Toast />
  
</template>
