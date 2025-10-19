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
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="login-button"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/auth.js'

const router = useRouter()

// Reactive data
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Handle form submission
const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await AuthService.login(email.value, password.value)
    
    if (result.success) {
      // Redirect to dashboard on successful login
      router.push('/dashboard')
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Container with light gray background */
.login-container {
  min-height: 100vh;
  background-color: #EEEEEE;
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
  color: #4A148C; /* Dark purple */
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
  color: #4A148C; /* Dark purple */
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #4A148C; /* Dark purple text */
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4A148C;
}

.form-input::placeholder {
  color: #999;
}

/* Login button with orange background */
.login-button {
  background-color: #FF5722; /* Orange */
  color: white;
  padding: 10px 20px; /* As specified */
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #FF8A50; /* Lighter orange on hover */
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Error message */
.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #ffebee;
  border: 1px solid #f44336;
  border-radius: 4px;
  color: #333333; /* Dark gray as specified */
  font-size: 0.9rem;
  text-align: center;
}

/* Responsive design for mobile (max-width: 600px) */
@media (max-width: 600px) {
  .login-container {
    padding: 0.5rem;
  }

  .login-card {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .login-form {
    gap: 1rem;
  }

  .form-input {
    padding: 0.625rem;
  }

  .login-button {
    padding: 12px 20px;
    font-size: 1rem;
  }
}

/* Extra small screens */
@media (max-width: 400px) {
  .login-card {
    padding: 1rem;
    margin: 0.5rem;
  }

  .login-title {
    font-size: 1.25rem;
  }
}
</style>