Authentication and User Management Design (Firebase Integration)
Initial Setup

Create Main Admin:

Step 1: Initialize Firebase Authentication.
Step 2: Manually create the first admin account using Firebase Console or a one-time script.

Full Name: Enter "Main Admin".
Email: Use a secure email (e.g., admin@kukhoma.org).
Password: Set a strong password (e.g., Admin@2025).
Phone Number: Add a valid number (e.g., +260977123456).


Step 3: Assign admin role via Firebase Custom Claims (e.g., { "admin": true }) to grant full access.
Step 4: Save admin credentials securely; this is a one-time setup.



Login Process (Post-Setup)

Login Interface:

Title: "Admin Login" centered on a light gray (#EEEEEE) background.
Fields:

Email: Text input for admin email, styled with dark purple (#4A148C) text.
Password: Password input, styled with dark purple (#4A148C) text.


Button: "Login" with orange (#FF5722) background, white text, and 10px 20px padding.
Hover Effect: Button lightens to #FF8A50 on hover.


Process:

Step 1: Admin enters Email and Password.
Step 2: Firebase authenticates credentials.
Step 3: On success, redirect to the Kukhoma Project Dashboard.
Step 4: On failure, display error in dark gray (#333333) below the form.


Responsive Design: Stack fields vertically on mobile (max-width: 600px).

Notes

No further admin creation after initial setup; only login is required.
Use Firebase’s signInWithEmailAndPassword for authentication.
Ensure secure storage of initial admin credentials post-setup.