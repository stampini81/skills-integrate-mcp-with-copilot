document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  const signupNote = document.getElementById("signup-note");
  const userMenuButton = document.getElementById("user-menu-button");
  const authMenu = document.getElementById("auth-menu");
  const authStatus = document.getElementById("auth-status");
  const openLoginButton = document.getElementById("open-login-button");
  const logoutButton = document.getElementById("logout-button");
  const loginModal = document.getElementById("login-modal");
  const closeLoginButton = document.getElementById("close-login-button");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  let adminToken = localStorage.getItem("adminToken") || "";
  let adminUsername = localStorage.getItem("adminUsername") || "";

  function isLoggedIn() {
    return adminToken !== "";
  }

  function showMessage(text, type = "info") {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.classList.remove("hidden");
    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 5000);
  }

  function updateAuthUI() {
    if (isLoggedIn()) {
      authStatus.textContent = `Logged in as ${adminUsername}`;
      openLoginButton.classList.add("hidden");
      logoutButton.classList.remove("hidden");
      signupNote.textContent = "Teacher mode enabled: you can register and unregister students.";
    } else {
      authStatus.textContent = "Not logged in";
      openLoginButton.classList.remove("hidden");
      logoutButton.classList.add("hidden");
      signupNote.textContent = "Teacher login is required to register or unregister students.";
    }
  }

  async function loginTeacher(username, password) {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || "Login failed");
    }

    adminToken = result.token;
    adminUsername = result.username;
    localStorage.setItem("adminToken", adminToken);
    localStorage.setItem("adminUsername", adminUsername);
    updateAuthUI();
    fetchActivities();
    showMessage("Teacher login successful.", "success");
  }

  async function logoutTeacher() {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "X-Admin-Token": adminToken,
        },
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    adminToken = "";
    adminUsername = "";
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    updateAuthUI();
    fetchActivities();
    showMessage("Logged out.", "info");
  }

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft =
          details.max_participants - details.participants.length;

        // Create participants HTML with delete icons instead of bullet points
        const participantsHTML =
          details.participants.length > 0
            ? `<div class="participants-section">
              <h5>Participants:</h5>
              <ul class="participants-list">
                ${details.participants
                  .map(
                    (email) =>
                      `<li><span class="participant-email">${email}</span>${
                        isLoggedIn()
                          ? `<button class="delete-btn" data-activity="${name}" data-email="${email}">Remove</button>`
                          : ""
                      }</li>`
                  )
                  .join("")}
              </ul>
            </div>`
            : `<p><em>No participants yet</em></p>`;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-container">
            ${participantsHTML}
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

      // Add event listeners to delete buttons
      if (isLoggedIn()) {
        document.querySelectorAll(".delete-btn").forEach((button) => {
          button.addEventListener("click", handleUnregister);
        });
      }
    } catch (error) {
      activitiesList.innerHTML =
        "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle unregister functionality
  async function handleUnregister(event) {
    if (!isLoggedIn()) {
      showMessage("Teacher login required.", "error");
      return;
    }

    const button = event.target;
    const activity = button.getAttribute("data-activity");
    const email = button.getAttribute("data-email");

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(
          activity
        )}/unregister?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          headers: {
            "X-Admin-Token": adminToken,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        showMessage(result.message, "success");

        // Refresh activities list to show updated participants
        fetchActivities();
      } else {
        showMessage(result.detail || "An error occurred", "error");
      }
    } catch (error) {
      showMessage("Failed to unregister. Please try again.", "error");
      console.error("Error unregistering:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isLoggedIn()) {
      showMessage("Teacher login required to register students.", "error");
      return;
    }

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(
          activity
        )}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "X-Admin-Token": adminToken,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        showMessage(result.message, "success");
        signupForm.reset();

        // Refresh activities list to show updated participants
        fetchActivities();
      } else {
        showMessage(result.detail || "An error occurred", "error");
      }
    } catch (error) {
      showMessage("Failed to sign up. Please try again.", "error");
      console.error("Error signing up:", error);
    }
  });

  userMenuButton.addEventListener("click", () => {
    authMenu.classList.toggle("hidden");
  });

  openLoginButton.addEventListener("click", () => {
    authMenu.classList.add("hidden");
    loginModal.classList.remove("hidden");
    usernameInput.focus();
  });

  closeLoginButton.addEventListener("click", () => {
    loginModal.classList.add("hidden");
    loginForm.reset();
  });

  logoutButton.addEventListener("click", () => {
    authMenu.classList.add("hidden");
    logoutTeacher();
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
      await loginTeacher(username, password);
      loginModal.classList.add("hidden");
      loginForm.reset();
    } catch (error) {
      showMessage(error.message, "error");
    }
  });

  // Initialize app
  updateAuthUI();
  fetchActivities();
});
