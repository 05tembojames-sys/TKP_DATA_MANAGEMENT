<template>
  <div class="login-wrapper">
    <header class="login-header">
      <div class="brand">
        <div class="brand-logo">TKP</div>
        <div class="brand-text">
          <div class="brand-title">The Kukhoma Project</div>
          <div class="brand-subtitle">Data Management System</div>
        </div>
      </div>
      <div class="actions">
        <select v-model="selectedLanguage" class="language-select" aria-label="Language">
          <option value="en">English</option>
          <option value="bm">Bemba</option>
          <option value="ny">Nyanja</option>
        </select>
      </div>
    </header>

    <main class="login-main">
      <div class="login-panel">
        <div class="panel-title">Log in</div>
        <form @submit.prevent="handleLogin" class="panel-form">
          <div class="form-row">
            <label for="email" class="form-label">Email</label>
            <div class="input-wrap">
              <i class="fa-solid fa-user"></i>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="input"
                placeholder="Enter your email"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="form-row">
            <label for="password" class="form-label">Password</label>
            <div class="input-wrap">
              <i class="fa-solid fa-lock"></i>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="input"
                placeholder="Enter your password"
                :disabled="loading"
              />
            </div>
          </div>

          <button type="submit" :disabled="loading" class="primary-btn">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Logging in..." : "Log in" }}
          </button>

          <div class="support-row">
            <a href="#" class="link" @click.prevent>Forgot password?</a>
          </div>

          <div v-if="error" class="error">
            {{ error }}
          </div>

          <div v-if="offlineMode" class="offline">
            Offline mode: using cached credentials
          </div>
        </form>
      </div>
    </main>

    <footer class="login-footer">
      <div class="footer-left">TKP Outreach • v1.0</div>
      <div class="footer-right">© 2025 TKP</div>
    </footer>
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
const selectedLanguage = ref("en");

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
.login-wrapper {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: linear-gradient(180deg, #f7fafc 0%, #eef2f7 100%);
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #2c6693;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.brand-title {
  font-weight: 700;
  color: #1f2937;
}

.brand-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.language-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
}

.login-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.login-panel {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(31, 41, 55, 0.08);
  padding: 1.5rem;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.panel-form {
  display: grid;
  gap: 1rem;
}

.form-row {
  display: grid;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 600;
}

.input-wrap {
  position: relative;
}

.input-wrap i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.input {
  width: 100%;
  padding: 0.65rem 0.75rem 0.65rem 2.25rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #2c6693;
  box-shadow: 0 0 0 3px rgba(44, 102, 147, 0.15);
}

.primary-btn {
  width: 100%;
  background: #2c6693;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary-btn:hover:not(:disabled) {
  background: #285a81;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.support-row {
  display: flex;
  justify-content: flex-end;
}

.link {
  color: #2c6693;
  text-decoration: none;
  font-size: 0.9rem;
}

.link:hover { text-decoration: underline; }

.error {
  color: #b91c1c;
  background: #fee2e2;
  border-left: 4px solid #b91c1c;
  border-radius: 6px;
  padding: 0.75rem;
}

.offline {
  color: #1d4ed8;
  background: #dbeafe;
  border-left: 4px solid #1d4ed8;
  border-radius: 6px;
  padding: 0.75rem;
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .login-panel { padding: 1rem; }
}
</style>
