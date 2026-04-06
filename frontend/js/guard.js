// ===============================
// AUTH GUARD (PROTECT PAGES)
// ===============================

function redirectToLogin() {
  window.location.replace("index.html");
}

function redirectToDashboard() {
  window.location.replace("dashboard.html");
}

// 🔐 Protect dashboard page
function protectRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
  }
}

// 🚫 Prevent logged-in users from seeing login/signup
function preventAuthPages() {
  const token = localStorage.getItem("token");

  if (token) {
    redirectToDashboard();
  }
}