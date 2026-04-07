const isLocalFrontend =
  window.location.protocol === "file:" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const API_BASE = isLocalFrontend
  ? `http://${window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost"}:5000/api`
  : "https://bac-api-n1je.onrender.com/api";

let refreshPromise = null;

async function parsePayload(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const payload = await parsePayload(response);

        if (!response.ok) {
          throw new Error(payload.message || "Session refresh failed");
        }

        return payload.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request(endpoint, options = {}, shouldRetry = true) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body || undefined,
  });

  const payload = await parsePayload(response);

  if (response.status === 401 && shouldRetry && !endpoint.startsWith("/auth/")) {
    await refreshSession();
    return request(endpoint, options, false);
  }

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
}

window.apiClient = {
  login(credentials) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register(user) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },

  refresh() {
    return refreshSession();
  },

  logout() {
    return request("/auth/logout", {
      method: "POST",
    });
  },

  getProfile() {
    return request("/users/me");
  },

  getAllUsers() {
    return request("/users/all");
  },
};
