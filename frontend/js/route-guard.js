(function () {
  const fallbackApiBase =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? `http://${window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost"}:5000/api`
      : "https://bac-api-n1je.onrender.com/api";

  const authApiBase =
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
      return await fetch(`${authApiBase}${endpoint}`, {
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

  async function preventAuthPages() {
    const isAuthenticated = await hasActiveSession();

    if (isAuthenticated) {
      redirectToDashboard();
    }
  }

  window.redirectToLogin = redirectToLogin;
  window.redirectToDashboard = redirectToDashboard;
  window.hasActiveSession = hasActiveSession;
  window.protectRoute = protectRoute;
  window.preventAuthPages = preventAuthPages;
})();
