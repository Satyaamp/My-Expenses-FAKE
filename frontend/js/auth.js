import { apiRequest, showToast } from "./api.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Ensure overlay is visible
  const overlay = document.getElementById('validation-overlay');
  if (overlay) overlay.style.display = 'flex';

  const MIN_DELAY = 3000; // 3 seconds minimum
  const startTime = Date.now();

  try {
    const res = await apiRequest("/auth/login", "POST", {
      email,
      password
    });

    // Wait for minimum delay
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_DELAY) {
      await new Promise(resolve => setTimeout(resolve, MIN_DELAY - elapsed));
    }

    // Save JWT
    localStorage.setItem("token", res.data);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (err) {
    // Also wait on error for consistent experience
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_DELAY) {
      await new Promise(resolve => setTimeout(resolve, MIN_DELAY - elapsed));
    }
    if (overlay) overlay.style.display = 'none';
    showToast(err.message, "error");
  }
});
