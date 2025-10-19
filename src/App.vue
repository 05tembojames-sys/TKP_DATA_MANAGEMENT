<script setup>
import { onMounted } from 'vue'
import AuthService from './services/auth.js'
import { useRouter } from 'vue-router'
import Toast from './components/Toast.vue'

const router = useRouter()

// Set up authentication state listener
onMounted(() => {
  AuthService.onAuthStateChange((user, isAuthenticated) => {
    if (isAuthenticated && router.currentRoute.value.path === '/login') {
      router.push('/dashboard')
    } else if (!isAuthenticated && router.currentRoute.value.path === '/dashboard') {
      router.push('/login')
    }
  })
})
</script>

<template>
  <div id="app">
    <router-view />
    <Toast />
  </div>
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>
