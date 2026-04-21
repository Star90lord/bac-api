(function () {
  const fallbackApiBase =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? `http://${window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost"}:5000/api`
      : "https://bac-api-arcl.onrender.com/api";

  const apiBase =
    window.appConfig?.apiBase || fallbackApiBase.replace(/\/+$/, "");

  let refreshPromise = null;

  function getRequestHeaders(options = {}) {
    const headers = {
      ...(options.headers || {}),
    };

    const hasBody = options.body !== undefined && options.body !== null;
    const hasContentType =
      Object.prototype.hasOwnProperty.call(headers, "Content-Type") ||
      Object.prototype.hasOwnProperty.call(headers, "content-type");

    if (hasBody && !hasContentType) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  async function parsePayload(response) {
    try {
      return await response.json();
    } catch (error) {
      return {};
    }
  }

  async function refreshSession() {
    if (!refreshPromise) {
      refreshPromise = fetch(`${apiBase}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })
        .then(async (response) => {
          const payload = await parsePayload(response);

          if (!response.ok) {
            throw new Error(payload.message || "Session refresh failed");
          }

          return payload.data;
        })
        .catch((error) => {
          if (error instanceof TypeError) {
            throw new Error("Unable to connect to the backend server");
          }

          throw error;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  }

  async function request(endpoint, options = {}, shouldRetry = true) {
    let response;

    try {
      const headers = getRequestHeaders(options);
      response = await fetch(`${apiBase}${endpoint}`, {
        credentials: "include",
        method: options.method || "GET",
        ...(Object.keys(headers).length ? { headers } : {}),
        body: options.body || undefined,
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Unable to connect to the backend server");
      }

      throw error;
    }

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

    updateProfile(updates) {
      return request("/users/me", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    },

    getAllUsers() {
      return request("/users/all");
    },
  };
})();
