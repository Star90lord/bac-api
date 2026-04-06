const API_BASE = "http://localhost:5000/api";

/**
 * Safe request handler with proper error handling
 */
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body || undefined,
    });

    // safely parse JSON (even if empty response)
    let payload = {};
    try {
      payload = await response.json();
    } catch (err) {
      payload = {};
    }

    if (!response.ok) {
      throw new Error(payload.message || `HTTP Error ${response.status}`);
    }

    // backend standard: { success, data }
    return payload.data ?? payload;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

/**
 * API CLIENT (RBAC SYSTEM)
 */
window.apiClient = {
  // LOGIN
  login(credentials) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // REGISTER
  register(user) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },

  // GET LOGGED IN USER PROFILE
  getProfile(token) {
    return request("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ADMIN ONLY: GET ALL USERS
  getAllUsers(token) {
    return request("/users/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
