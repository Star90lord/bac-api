// ===============================
// AUTH GUARD (PROTECT PAGES)
// ===============================

const isLocalFrontend =
  window.location.protocol === "file:" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const AUTH_API_BASE = isLocalFrontend
  ? `http://${window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost"}:5000/api`
  : "https://bac-api-n1je.onrender.com/api";

function redirectToLogin() {
  window.location.replace("index.html");
}

function redirectToDashboard() {
  window.location.replace("dashboard.html");
}

// 🔐 Protect dashboard page
async function hasActiveSession() {
  try {
    const profileResponse = await fetch(`${AUTH_API_BASE}/users/me`, {
      credentials: "include",
    });

    if (profileResponse.ok) {
      return true;
    }

    if (profileResponse.status === 401) {
      const refreshResponse = await fetch(`${AUTH_API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      return refreshResponse.ok;
    }
  } catch (error) {
    console.error("Guard check failed:", error);
  }

  return false;
}

async function protectRoute() {
  const isAuthenticated = await hasActiveSession();

  if (!isAuthenticated) {
    redirectToLogin();
  }
}

// 🚫 Prevent logged-in users from seeing login/signup
async function preventAuthPages() {
  const isAuthenticated = await hasActiveSession();

  if (isAuthenticated) {
    redirectToDashboard();
  }
}
