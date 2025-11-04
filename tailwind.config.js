/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#f8f9fa", // Matches Capture.vue's background
        },
        blue: {
          500: "#007bff", // Matches Capture.vue's primary buttons
        },
        green: {
          500: "#28a745", // Matches Capture.vue's complete button
        },
        teal: {
          500: "#20c997", // Matches Capture.vue's gradients
        },
        yellow: {
          400: "#ffc107", // Matches Capture.vue's draft button
        },
        red: {
          400: "#dc3545", // Matches Capture.vue's validation errors
        },
      },
    },
  },
  plugins: [],
};
