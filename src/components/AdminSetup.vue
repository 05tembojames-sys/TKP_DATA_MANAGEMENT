<template>
  <div class="setup-container">
    <div class="setup-card">
      <h1 class="setup-title">CREATE MAIN ADMIN</h1>
      <p class="setup-subtitle">Set up the first administrator account for Kukhoma Project</p>
      
      <form @submit.prevent="handleSetup" class="setup-form">
        <div class="form-group">
          <label for="fullName" class="form-label">Full Name</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            required
            class="form-input"
            placeholder="Enter Main Admin"
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="admin@kukhoma.org"
          />
        </div>

        <div class="form-group">
          <label for="phoneNumber" class="form-label">Phone Number</label>
          <input
            id="phoneNumber"
            v-model="phoneNumber"
            type="tel"
            required
            class="form-input"
            placeholder="+260977123456"
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
            placeholder="Create a strong password"
            minlength="8"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="form-input"
            placeholder="Confirm your password"
            minlength="8"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="setup-button"
        >
          {{ loading ? 'Creating Admin...' : 'Create Admin Account' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="setup-info">
        <p><strong>Important:</strong> This is a one-time setup. Save these credentials securely.</p>
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
const fullName = ref('Main Admin')
const email = ref('admin@kukhoma.org')
const phoneNumber = ref('+260977123456')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

// Handle form submission
const handleSetup = async () => {
  // Validation
  if (!fullName.value || !email.value || !phoneNumber.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await AuthService.createFirstAdmin(
      email.value, 
      password.value, 
      fullName.value, 
      phoneNumber.value
    )
    
    if (result.success) {
      // Redirect to dashboard on successful setup
      router.push('/dashboard')
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Setup error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Container with light gray background */
.setup-container {
  min-height: 100vh;
  background-color: #EEEEEE;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Setup card */
.setup-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

/* Centered title */
.setup-title {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
  color: #4A148C; /* Dark purple */
}

.setup-subtitle {
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
  font-size: 0.9rem;
}

/* Form styling */
.setup-form {
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

/* Setup button with orange background */
.setup-button {
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

.setup-button:hover {
  background-color: #FF8A50; /* Lighter orange on hover */
}

.setup-button:disabled {
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

/* Setup info */
.setup-info {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border: 1px solid #4A148C;
  border-radius: 4px;
  text-align: center;
}

.setup-info p {
  color: #4A148C;
  font-size: 0.85rem;
  margin: 0;
}

/* Responsive design for mobile (max-width: 600px) */
@media (max-width: 600px) {
  .setup-container {
    padding: 0.5rem;
  }

  .setup-card {
    padding: 1.5rem;
  }

  .setup-title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .setup-subtitle {
    margin-bottom: 1.5rem;
  }

  .setup-form {
    gap: 1rem;
  }

  .form-input {
    padding: 0.625rem;
  }

  .setup-button {
    padding: 12px 20px;
    font-size: 1rem;
  }
}

/* Extra small screens */
@media (max-width: 400px) {
  .setup-card {
    padding: 1rem;
    margin: 0.5rem;
  }

  .setup-title {
    font-size: 1.25rem;
  }
}
</style>