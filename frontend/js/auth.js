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

function redirectAfterAuth(account) {
  if (account?.role === "admin") {
    window.location.replace("dashboard.html");
    return;
  }

  window.location.replace("home.html");
}

const loginForm = document.getElementById("loginForm");
let isSubmitting = false;

if (loginForm) {
  const modeButtons = Array.from(document.querySelectorAll("[data-login-mode]"));
  let activeMode =
    document.getElementById("loginMode")?.value?.trim() || "user";

  function syncModeButtons(nextMode) {
    activeMode = nextMode;

    const modeInput = document.getElementById("loginMode");
    const helperText = document.getElementById("loginModeHelp");

    if (modeInput) {
      modeInput.value = nextMode;
    }

    if (helperText) {
      helperText.textContent =
        nextMode === "admin"
          ? "Admin login is reserved for the configured admin account only."
          : "Use your customer account to access the freelancing marketplace.";
    }

    modeButtons.forEach((button) => {
      button.classList.toggle(
        "mode-toggle-btn-active",
        button.dataset.loginMode === nextMode
      );
    });
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      syncModeButtons(button.dataset.loginMode || "user");
    });
  });

  syncModeButtons(activeMode);

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
      setAuthState({ error: "Email and password are required", loading: false });
      return;
    }

    try {
      const account = await window.apiClient.login({
        email,
        password,
        loginAs: activeMode,
      });

      redirectAfterAuth(account);
    } catch (error) {
      console.error("Login error:", error);
      isSubmitting = false;
      setAuthState({
        error: error.message || "Login failed",
        loading: false,
      });
    }
  });
}

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
      await window.apiClient.register({
        name,
        email,
        password,
      });

      window.location.replace("home.html");
    } catch (error) {
      console.error("Signup error:", error);
      setAuthState({
        error: error.message || "Signup failed",
        loading: false,
      });
    }
  });
}
