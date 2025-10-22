<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">LOGIN</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="Enter your admin email"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="Enter your password"
            :disabled="loading"
          />
        </div>

        <button type="submit" :disabled="loading" class="login-button">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="offlineMode" class="offline-notice">
        <p>🔒 Offline Mode: Using cached login credentials</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AuthService from "../services/auth.js";

const router = useRouter();

// Reactive data
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const offlineMode = ref(false);

// Check if we're in offline mode on component mount
onMounted(() => {
  if (!navigator.onLine) {
    // Check if we have saved user data
    const savedAuthState = localStorage.getItem("tkp_auth_state");
    if (savedAuthState === "authenticated") {
      offlineMode.value = true;
    }
  }
});

// Handle form submission
const handleLogin = async () => {
  console.log("Login button clicked"); // Debug log

  if (!email.value || !password.value) {
    error.value = "Please fill in all fields";
    console.log("Validation failed: Missing email or password");
    return;
  }

  console.log("Attempting login with:", email.value); // Debug log
  loading.value = true;
  error.value = "";

  try {
    console.log("Calling AuthService.login()..."); // Debug log

    // Check if we're offline
    if (!navigator.onLine) {
      // Try to load offline user data
      AuthService.loadOfflineUserData();
      if (AuthService.isAuthenticated) {
        console.log("Offline login successful! Redirecting to dashboard...");
        offlineMode.value = true;
        // Redirect to dashboard on successful offline login
        await router.push("/dashboard");
        console.log("Navigation complete"); // Debug log
        return;
      } else {
        error.value =
          "No cached credentials found. Please connect to the internet and log in.";
        return;
      }
    }

    const result = await AuthService.login(email.value, password.value);

    console.log("Login result:", result); // Debug log

    if (result.success) {
      console.log("Login successful! Redirecting to dashboard..."); // Debug log
      // Redirect to dashboard on successful login
      await router.push("/dashboard");
      console.log("Navigation complete"); // Debug log
    } else {
      console.error("Login failed:", result.error); // Debug log
      error.value = result.error || "Login failed. Please try again.";
    }
  } catch (err) {
    console.error("Login error (catch block):", err); // Debug log
    error.value =
      "An unexpected error occurred: " + (err.message || "Unknown error");
  } finally {
    loading.value = false;
    console.log("Login process completed, loading set to false"); // Debug log
  }
};
</script>

<style scoped>
/* Container with light gray background */
.login-container {
  min-height: 100vh;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Login card */
.login-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

/* Centered title */
.login-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
  color: #4a148c; /* Dark purple */
}

/* Form styling */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #4a148c; /* Dark purple */
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #4a148c; /* Dark purple text */
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4a148c;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: #999;
}

/* Login button with orange background */
.login-button {
  background-color: #ff5722; /* Orange */
  color: white;
  padding: 10px 20px; /* As specified */
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background-color: #ff8a50; /* Lighter orange on hover */
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Loading spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error message */
.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  border-left: 4px solid #d32f2f;
}

/* Offline notice */
.offline-notice {
  color: #1976d2;
  background-color: #e3f2fd;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  border-left: 4px solid #1976d2;
  text-align: center;
  font-weight: 500;
}
</style>
