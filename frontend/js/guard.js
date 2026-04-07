// ===============================
// AUTH GUARD (PROTECT PAGES)
// ===============================

const isLocalFrontend =
  window.location.protocol === "file:" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const fallbackApiBase = isLocalFrontend
  ? `http://${window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost"}:5000/api`
  : "https://bac-api-arcl.onrender.com/api";
const AUTH_API_BASE =
  window.appConfig?.apiBase || fallbackApiBase.replace(/\/+$/, "");
const shouldLogGuardFailures = Boolean(window.appConfig?.isLocalFrontend);

function redirectToLogin() {
  window.location.replace("index.html");
}

function redirectToDashboard() {
  window.location.replace("dashboard.html");
}

async function safeSessionRequest(endpoint, options = {}) {
  try {
    return await fetch(`${AUTH_API_BASE}${endpoint}`, {
      credentials: "include",
      cache: "no-store",
      ...options,
    });
  } catch (error) {
    if (shouldLogGuardFailures) {
      console.warn("Guard check failed:", error.message || error);
    }

    return null;
  }
}

// 🔐 Protect dashboard page
async function hasActiveSession() {
  const profileResponse = await safeSessionRequest("/users/me");

  if (!profileResponse) {
    return false;
  }

  if (profileResponse.ok) {
    return true;
  }

  if (profileResponse.status === 401) {
    const refreshResponse = await safeSessionRequest("/auth/refresh", {
      method: "POST",
    });

    return Boolean(refreshResponse?.ok);
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
