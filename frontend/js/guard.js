// ===============================
// AUTH GUARD (PROTECT PAGES)
// ===============================

const AUTH_HOST =
  window.location.protocol === "file:"
    ? "localhost"
    : window.location.hostname || "localhost";
const AUTH_API_BASE = `http://${AUTH_HOST}:5000/api`;

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
