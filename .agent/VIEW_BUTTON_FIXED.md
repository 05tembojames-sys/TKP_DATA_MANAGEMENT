# ✅ View Button Fixed

## 🎉 Complete!

I've fixed the issue where clicking the "View" button in the Capture app was redirecting to the dashboard.

---

## 🔧 The Fix

1. **Problem**: The "View" button was trying to navigate to `/capture/view/:id`, a route that didn't exist. This caused the app to fall back to the default route (Dashboard).
2. **Solution**: I updated the button to open the **Event Details Sidebar** right on the current page.

---

## 🚀 How to Test

1. **Refresh your browser**
2. Go to **Capture** app.
3. Select an Organisation Unit and Program to load the list.
4. Click the **View (Eye) icon** on any row.
5. **Success!** The details sidebar will slide in from the right, showing the child's information.

---

**No more unexpected redirects!** 🛑
