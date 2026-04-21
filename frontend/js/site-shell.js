(function () {
  let pendingAvatar = "";
  let activeTrigger = null;
  let activeDropdown = null;

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

  // Image compression utility
  function compressImage(base64String, callback, quality = 0.7) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      
      // Scale down if image is very large
      const maxWidth = 800;
      const maxHeight = 800;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      callback(compressedBase64);
    };
    img.src = base64String;
  }

  function getDisplayName(user) {
    const providedName = String(user?.name || "").trim();

    if (providedName) {
      return providedName;
    }

    const emailPrefix = String(user?.email || "")
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .trim();

    return emailPrefix || "Freelancer";
  }

  function getInitials(user) {
    const source = getDisplayName(user);

    return source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  function getAvatarMarkup(user, className) {
    if (user?.avatar) {
      return `<img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(
        getDisplayName(user)
      )}" class="${className}" />`;
    }

    return `<span class="${className} avatar-fallback">${escapeHtml(
      getInitials(user)
    )}</span>`;
  }

  async function fetchActiveUser() {
    if (!window.apiClient?.getProfile) {
      return null;
    }

    try {
      return await window.apiClient.getProfile();
    } catch (error) {
      return null;
    }
  }

  function renderLoggedOutActions(actionsEl) {
    actionsEl.innerHTML = `
      <a class="nav-link" href="home.html">Home</a>
      <a class="nav-link" href="services.html">Services</a>
      <a class="nav-button nav-button-secondary" href="index.html">Login</a>
      <a class="nav-button" href="signup.html">Register</a>
    `;
  }

  function renderLoggedInActions(actionsEl, user) {
    actionsEl.innerHTML = `
      <a class="nav-link" href="home.html">Home</a>
      <a class="nav-link" href="services.html">Services</a>
      ${user.role === "admin" ? '<a class="nav-link" href="dashboard.html">Admin Dashboard</a>' : ""}
      <div class="profile-menu">
        <button type="button" class="profile-trigger" id="profileTrigger">
          ${getAvatarMarkup(user, "profile-avatar")}
          <span>${escapeHtml(getDisplayName(user))}</span>
        </button>
        <div class="profile-dropdown" id="profileDropdown" hidden>
          <div class="profile-summary">
            ${getAvatarMarkup(user, "profile-avatar-large")}
            <div>
              <strong>${escapeHtml(getDisplayName(user))}</strong>
              <p>${escapeHtml(user.email || "")}</p>
              <span class="profile-role">${escapeHtml(user.role || "user")}</span>
            </div>
          </div>
          <label class="input-group profile-inline-field">
            <span>Display name</span>
            <input type="text" id="profileNameInput" value="${escapeHtml(
              getDisplayName(user)
            )}" placeholder="Your name" />
          </label>
          <label class="input-group profile-inline-field">
            <span>Profile picture</span>
            <input type="file" id="profileAvatarInput" accept="image/*" />
          </label>
          <p id="profileStatus" class="profile-status"></p>
          <button type="button" class="dropdown-button" id="saveProfileBtn">Save Profile</button>
          <button type="button" class="dropdown-link danger-link" id="logoutBtn">Logout</button>
        </div>
      </div>
    `;

    attachProfileMenuHandlers(user);
  }

  function closeDropdown(dropdown) {
    if (dropdown) {
      dropdown.hidden = true;
    }
  }

  function attachProfileMenuHandlers(user) {
    const trigger = document.getElementById("profileTrigger");
    const dropdown = document.getElementById("profileDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const profileNameInput = document.getElementById("profileNameInput");
    const profileAvatarInput = document.getElementById("profileAvatarInput");
    const profileStatus = document.getElementById("profileStatus");

    if (trigger && dropdown) {
      activeTrigger = trigger;
      activeDropdown = dropdown;

      trigger.addEventListener("click", () => {
        dropdown.hidden = !dropdown.hidden;
      });
    }

    if (profileAvatarInput) {
      profileAvatarInput.addEventListener("change", () => {
        const [file] = profileAvatarInput.files || [];

        if (!file) {
          pendingAvatar = "";
          return;
        }

        if (!file.type.startsWith("image/")) {
          profileStatus.textContent = "❌ Please choose a valid image file.";
          profileStatus.classList.add("error");
          profileAvatarInput.value = "";
          pendingAvatar = "";
          return;
        }

        // Check file size (max 5MB)
        const maxSizeMB = 5;
        if (file.size > maxSizeMB * 1024 * 1024) {
          profileStatus.textContent = `❌ Image must be less than ${maxSizeMB}MB.`;
          profileStatus.classList.add("error");
          profileAvatarInput.value = "";
          pendingAvatar = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const base64 = typeof reader.result === "string" ? reader.result : "";
          
          // Compress image if it's large
          if (base64.length > 500000) { // ~500KB
            compressImage(base64, (compressedBase64) => {
              pendingAvatar = compressedBase64;
              const originalKB = (base64.length / 1024).toFixed(1);
              const compressedKB = (compressedBase64.length / 1024).toFixed(1);
              profileStatus.textContent = `✓ Image ready (${compressedKB}KB, compressed from ${originalKB}KB)`;
              profileStatus.classList.remove("error");
            });
          } else {
            pendingAvatar = base64;
            const fileSizeKB = (base64.length / 1024).toFixed(1);
            profileStatus.textContent = `✓ Image ready to save (${fileSizeKB}KB)`;
            profileStatus.classList.remove("error");
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (saveProfileBtn) {
      saveProfileBtn.addEventListener("click", async () => {
        if (!window.apiClient?.updateProfile) {
          return;
        }

        saveProfileBtn.disabled = true;
        profileStatus.textContent = "⏳ Saving profile...";
        profileStatus.classList.remove("error");

        try {
          const updatedUser = await window.apiClient.updateProfile({
            name: profileNameInput?.value?.trim() || getDisplayName(user),
            ...(pendingAvatar
              ? { avatar: pendingAvatar }
              : profileAvatarInput?.value
                ? { avatar: "" }
                : {}),
          });

          pendingAvatar = "";
          profileStatus.textContent = "✅ Profile saved successfully!";
          profileStatus.classList.remove("error");
          renderSiteActions(updatedUser);

          const profileNameTargets = document.querySelectorAll("[data-user-name]");
          profileNameTargets.forEach((node) => {
            node.textContent = getDisplayName(updatedUser);
          });
        } catch (error) {
          profileStatus.textContent = `❌ ${error.message || "Unable to save profile. Check image size (max 5MB)."}`;
          profileStatus.classList.add("error");
        } finally {
          saveProfileBtn.disabled = false;
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          await window.apiClient.logout();
        } catch (error) {
          console.error("Logout error:", error);
        }

        window.location.replace("home.html");
      });
    }
  }

  async function renderSiteActions(userOverride) {
    const actionsEl = document.getElementById("siteActions");

    if (!actionsEl) {
      return;
    }

    const user = userOverride || (await fetchActiveUser());
    window.activeSiteUser = user;

    if (!user) {
      renderLoggedOutActions(actionsEl);
      return;
    }

    renderLoggedInActions(actionsEl, user);

    const profileNameTargets = document.querySelectorAll("[data-user-name]");
    profileNameTargets.forEach((node) => {
      node.textContent = getDisplayName(user);
    });
  }

  window.renderSiteActions = renderSiteActions;

  document.addEventListener("DOMContentLoaded", () => {
    renderSiteActions();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (
      activeDropdown &&
      activeTrigger &&
      !activeDropdown.contains(target) &&
      !activeTrigger.contains(target)
    ) {
      closeDropdown(activeDropdown);
    }
  });
})();
