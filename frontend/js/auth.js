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
  window.location.replace("dashboard.html");
}

/**
 * LOGIN HANDLER
 */
const loginForm = document.getElementById("loginForm");
let isSubmitting = false;

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    isSubmitting = true;
    setAuthState({ error: "", loading: true });

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      isSubmitting = false;
      setAuthState({ error: "All fields are required", loading: false });
      return;
    }

    try {
      await window.apiClient.login({ email, password });
      window.location.replace("dashboard.html");

    } catch (error) {
      console.error("Login error:", error);
      isSubmitting = false;
      setAuthState({ loading: false });
      alert(error.message || "Login failed");
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
    const role = document.getElementById("role")?.value || "user";

    if (!name || !email || !password) {
      setAuthState({ error: "All fields are required", loading: false });
      return;
    }

    try {
      await window.apiClient.register({
        name,
        email,
        password,
        role,
      });
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
