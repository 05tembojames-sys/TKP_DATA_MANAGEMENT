The Kukhoma Project Dashboard
Color Theme

Primary Color (Logo/Text): Dark purple (#4A148C) – Used for the "K" logo and primary text like "THE KUKHOMA PROJECT".
Accent Color (Buttons): Orange (#FF5722) – Applied to buttons such as "Tracker Capture/outreach", "Reports -weekly/...", etc.
Background Color: Light gray (#EEEEEE) – The main dashboard background.
Secondary Elements: White (#FFFFFF) for button backgrounds or highlights; dark gray (#333333) for subtle text or secondary labels.

Layout Description

Top Section:

A white card positioned at the top-left containing the "K" logo in dark purple.
Title "THE KUKHOMA PROJECT" in dark purple below the logo.


Main Content:

A light gray background filling the rest of the dashboard.
Buttons arranged in a 2-column grid or horizontal row, centered or evenly spaced.
Each button styled with an orange background, white text, and slight padding for readability.


Navigation/Functionality:

Buttons include: "Tracker Capture/outreach", "Reports -weekly/...", "Event Reports", "Child Tracker -in-house/children", "Visualization", "Data Analysis", "Capture", "Child Tracker/in-housed chi...".
Optional hover effect: Buttons lighten (e.g., #FF8A50) on mouse-over.



Visual Notes

Use CSS for styling:

Background: background-color: #EEEEEE;
Buttons: background-color: #FF5722; color: #FFFFFF; padding: 10px 20px; border: none; border-radius: 5px;
Logo/Text: color: #4A148C; font-weight: bold;
Hover: background-color: #FF8A50; transition: background-color 0.3s;


Ensure responsive design: Stack buttons vertically on mobile views (max-width: 600px).
Placeholder for logo image: [Insert K Logo] (to be replaced with actual image path or SVG).
4.5sFastnow the authentication i will be using firebase the admin will only be one , and will manage  them from the dashboard when the button mangae users , and the fileds include full name ,  email,  password  , phone number as well , Authentication and User Management (Firebase Integration)
Authentication Overview

Platform: Firebase Authentication.
Admin Role: Single admin with full control, authenticated via Firebase.
Access Point: Managed through the dashboard via the "Manage Users" button.

User Management Fields

Full Name: Text field for the user's complete name.
Email: Email field for user login and Firebase authentication.
Password: Password field for secure user login (hashed by Firebase).
Phone Number: Text field for contact, optional for Firebase phone authentication.

Dashboard Layout for Manage Users

Section Title: "Manage Users" displayed when the "Manage Users" button is clicked.
Table Structure:

Columns: Full Name, Email, Password, Phone Number.
Rows: List of registered users (editable by admin).
Actions: Add new user (form), Edit existing user, Delete user.


Color Theme (consistent with dashboard):

Background: Light gray (#EEEEEE).
Text/Labels: Dark purple (#4A148C).
Buttons (Add/Edit/Delete): Orange (#FF5722) with white text.
Hover Effect: Lighten to #FF8A50.