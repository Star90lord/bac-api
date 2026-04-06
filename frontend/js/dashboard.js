function redirectToLogin() {
  window.location.href = "index.html";
}

/**
 * SAFE RENDER USER UI
 */
function renderUserProfile(user) {
  const userInfo = document.getElementById("userInfo");
  const roleDisplay = document.getElementById("roleDisplay");
  const getUsersButton = document.getElementById("getUsersBtn");
  const adminSection = document.getElementById("adminSection");

  if (!user) return;

  if (userInfo) {
    userInfo.innerHTML = `
      <p><strong>Name:</strong> ${user.name || "N/A"}</p>
      <p><strong>Email:</strong> ${user.email || "N/A"}</p>
      <p><strong>Role:</strong> ${user.role || "user"}</p>
    `;
  }

  if (roleDisplay) {
    roleDisplay.value = user.role || "user";
  }

  if (adminSection) {
    adminSection.style.display = user.role === "admin" ? "block" : "none";
  }

  if (getUsersButton) {
    getUsersButton.disabled = user.role !== "admin";
  }
}

/**
 * LOAD DASHBOARD
 */
async function loadDashboard() {
  const token = localStorage.getItem("token");
  const cachedUser = localStorage.getItem("user");

  const userInfo = document.getElementById("userInfo");

  if (!token) {
    redirectToLogin();
    return;
  }

  // STEP 1: try cached user first (fast UI load)
  if (cachedUser) {
    try {
      renderUserProfile(JSON.parse(cachedUser));
    } catch {}
  }

  // STEP 2: verify with backend
  try {
    const user = await window.apiClient.getProfile(token);

    const cleanUser = user?.data || user;

    if (!cleanUser) throw new Error("Invalid user response");

    localStorage.setItem("user", JSON.stringify(cleanUser));

    renderUserProfile(cleanUser);

  } catch (error) {
    console.error("Profile error:", error);

    if (userInfo) {
      userInfo.innerHTML =
        '<p class="error-text">Session expired. Redirecting...</p>';
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setTimeout(redirectToLogin, 1000);
  }
}

/**
 * ADMIN: GET ALL USERS
 */
const getUsersButton = document.getElementById("getUsersBtn");

if (getUsersButton) {
  getUsersButton.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const adminData = document.getElementById("adminData");

    if (!token) {
      redirectToLogin();
      return;
    }

    try {
      const users = await window.apiClient.getAllUsers(token);

      const list = users?.data || users;

      if (!Array.isArray(list)) {
        throw new Error("Invalid users response");
      }

      adminData.innerHTML = `
        <h3>All Users</h3>
        ${list
          .map(
            (user) => `
              <p>
                ${user.name || "N/A"} 
                (${user.email || "N/A"}) - 
                <strong>${user.role || "user"}</strong>
              </p>
            `
          )
          .join("")}
      `;

    } catch (error) {
      console.error("Admin fetch error:", error);
      alert(error.message || "Access denied or server error");
    }
  });
}

/**
 * LOGOUT
 */
const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    redirectToLogin();
  });
}

/**
 * AUTO LOAD
 */
if (document.getElementById("userInfo")) {
  loadDashboard();
}
