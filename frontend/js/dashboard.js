function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char] || char;
  });
}

function getDisplayName(user) {
  const providedName = String(user?.name || "").trim();

  if (providedName) {
    return providedName;
  }

  const emailName = String(user?.email || "")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  return emailName || "Freelancer";
}

function renderUserProfile(user) {
  const userInfo = document.getElementById("userInfo");
  const roleDisplay = document.getElementById("roleDisplay");
  const accessLevel = document.getElementById("accessLevel");
  const collectionDisplay = document.getElementById("collectionDisplay");
  const getUsersButton = document.getElementById("getUsersBtn");
  const adminSection = document.getElementById("adminSection");
  const adminIntro = document.getElementById("adminIntro");

  if (!user) {
    return;
  }

  if (userInfo) {
    userInfo.innerHTML = `
      <article class="detail-card">
        <span class="info-label">Display Name</span>
        <h4>${escapeHtml(getDisplayName(user))}</h4>
        <p>This is the profile name shown in your navigation dropdown.</p>
      </article>
      <article class="detail-card">
        <span class="info-label">Email</span>
        <h4>${escapeHtml(user.email || "N/A")}</h4>
        <p>Your account email is used as the secure sign-in identity.</p>
      </article>
      <article class="detail-card">
        <span class="info-label">Role</span>
        <h4>${escapeHtml(user.role || "user")}</h4>
        <p>${user.role === "admin" ? "This account can review all platform members and admin-only data." : "This account can browse services, manage its profile, and use the customer-facing experience."}</p>
      </article>
      <article class="detail-card">
        <span class="info-label">Collection</span>
        <h4>${escapeHtml(user.collection || "users")}</h4>
        <p>The backend keeps users and the fixed admin account in separate collections.</p>
      </article>
    `;
  }

  if (roleDisplay) {
    roleDisplay.value = user.role || "user";
  }

  if (accessLevel) {
    accessLevel.textContent =
      user.role === "admin" ? "Admin privileges enabled" : "Customer account";
  }

  if (collectionDisplay) {
    collectionDisplay.textContent = user.collection || "users";
  }

  if (adminSection) {
    adminSection.style.display = user.role === "admin" ? "block" : "none";
  }

  if (adminIntro) {
    adminIntro.textContent =
      user.role === "admin"
        ? "The fixed admin account can review all registered users below."
        : "";
  }

  if (getUsersButton) {
    getUsersButton.style.display = user.role === "admin" ? "inline-flex" : "none";
  }
}

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

    window.location.replace("index.html");
  }
}

const getUsersButton = document.getElementById("getUsersBtn");

if (getUsersButton) {
  getUsersButton.addEventListener("click", async () => {
    const adminData = document.getElementById("adminData");

    try {
      const users = await window.apiClient.getAllUsers();

      if (!Array.isArray(users)) {
        throw new Error("Invalid users response");
      }

      adminData.innerHTML = users
        .map(
          (user) => `
            <article class="admin-user-card">
              <span class="info-label">${escapeHtml(user.collection || "accounts")}</span>
              <h4>${escapeHtml(getDisplayName(user))}</h4>
              <p>${escapeHtml(user.email || "N/A")}</p>
              <p><strong>Role:</strong> ${escapeHtml(user.role || "user")}</p>
            </article>
          `
        )
        .join("");
    } catch (error) {
      console.error("Admin fetch error:", error);

      if (adminData) {
        adminData.innerHTML = `<p class="error-text">${escapeHtml(
          error.message || "Access denied or server error"
        )}</p>`;
      }
    }
  });
}

if (document.getElementById("userInfo")) {
  loadDashboard();
}
