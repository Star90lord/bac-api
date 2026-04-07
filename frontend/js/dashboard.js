function redirectToLogin() {
  window.location.replace("index.html");
}

/**
 * SAFE RENDER USER UI
 */
function renderUserProfile(user) {
  const userInfo = document.getElementById("userInfo");
  const roleDisplay = document.getElementById("roleDisplay");
  const accessLevel = document.getElementById("accessLevel");
  const collectionDisplay = document.getElementById("collectionDisplay");
  const getUsersButton = document.getElementById("getUsersBtn");
  const adminSection = document.getElementById("adminSection");

  if (!user) return;

  if (userInfo) {
    userInfo.innerHTML = `
      <article class="detail-card">
        <span class="info-label">Identity</span>
        <h4>${user.name || "N/A"}</h4>
        <p>Account holder name shown for the active protected session.</p>
      </article>
      <article class="detail-card">
        <span class="info-label">Contact</span>
        <h4>${user.email || "N/A"}</h4>
        <p>Primary email connected to this role-aware profile.</p>
      </article>
      <article class="detail-card">
        <span class="info-label">Permission Scope</span>
        <h4>${user.role || "user"}</h4>
        <p>${user.role === "admin" ? "Elevated visibility with management privileges." : "Standard protected access with a focused dashboard view."}</p>
      </article>
      <article class="detail-card">
        <span class="info-label">Data Source</span>
        <h4>${user.collection || "users"}</h4>
        <p>Collection used by the backend to identify this account record.</p>
      </article>
    `;
  }

  if (roleDisplay) {
    roleDisplay.value = user.role || "user";
  }

  if (accessLevel) {
    accessLevel.textContent =
      user.role === "admin" ? "Admin Privileges" : "Protected User Access";
  }

  if (collectionDisplay) {
    collectionDisplay.textContent = user.collection || "users";
  }

  if (adminSection) {
    adminSection.style.display = user.role === "admin" ? "block" : "none";
  }

  if (getUsersButton && user.role !== "admin") {
    getUsersButton.style.display = "none";
  }

  if (getUsersButton && user.role === "admin") {
    getUsersButton.style.display = "block";
  }
}

/**
 * LOAD DASHBOARD
 */
async function loadDashboard() {
  const userInfo = document.getElementById("userInfo");

  try {
    const user = await window.apiClient.getProfile();
    renderUserProfile(user);

  } catch (error) {
    console.error("Auth failed:", error);
    if (userInfo) {
      userInfo.innerHTML = '<p class="error-text">Session expired.</p>';
    }
    alert("Session expired. Please login again.");
    redirectToLogin();
  }
}

/**
 * ADMIN: GET ALL USERS
 */
const getUsersButton = document.getElementById("getUsersBtn");

if (getUsersButton) {
  getUsersButton.addEventListener("click", async () => {
    const adminData = document.getElementById("adminData");

    try {
      const users = await window.apiClient.getAllUsers();

      const list = users?.data || users;

      if (!Array.isArray(list)) {
        throw new Error("Invalid users response");
      }

      adminData.innerHTML = `
        ${list
          .map(
            (user) => `
              <article class="admin-user-card">
                <span class="info-label">${user.collection || "accounts"}</span>
                <h4>${user.name || "N/A"}</h4>
                <p>${user.email || "N/A"}</p>
                <p><strong>Role:</strong> ${user.role || "user"}</p>
              </article>
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
  logoutButton.addEventListener("click", async () => {
    try {
      await window.apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    redirectToLogin();
  });
}

/**
 * AUTO LOAD
 */
if (document.getElementById("userInfo")) {
  loadDashboard();
}
