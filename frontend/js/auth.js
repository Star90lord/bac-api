function setAuthState({ error = "", loading = false }) {
  const errorEl = document.getElementById("errorMsg");
  const loadingEl = document.getElementById("loadingText");
  const submitButton =
    document.getElementById("loginBtn") ||
    document.getElementById("signupBtn");

  if (errorEl) {
    errorEl.textContent = error;
  }

  if (loadingEl) {
    loadingEl.hidden = !loading;
  }

  if (submitButton) {
    submitButton.disabled = loading;
  }
}

function redirectToDashboard() {
  window.location.href = "dashboard.html";
}

/**
 * LOGIN HANDLER
 */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setAuthState({ error: "", loading: true });

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // frontend validation
    if (!email || !password) {
      setAuthState({ error: "All fields are required", loading: false });
      return;
    }

    try {
      const data = await window.apiClient.login({ email, password });

      const token = data?.token;
      const user = {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
      };

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      redirectToDashboard();

    } catch (error) {
      console.error("Login error:", error);
      setAuthState({
        error: error.message || "Login failed",
        loading: false,
      });
    }
  });
}

/**
 * SIGNUP HANDLER
 */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setAuthState({ error: "", loading: true });

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!name || !email || !password) {
      setAuthState({ error: "All fields are required", loading: false });
      return;
    }

    try {
      const data = await window.apiClient.register({
        name,
        email,
        password,
      });

      const token = data?.token;
      const user = {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
      };

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      redirectToDashboard();

    } catch (error) {
      console.error("Signup error:", error);
      setAuthState({
        error: error.message || "Signup failed",
        loading: false,
      });
    }
  });
}
