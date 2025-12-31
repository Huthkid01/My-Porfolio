document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggleButton = document.getElementById("theme-toggle");

  /* ===== THEME TOGGLE ===== */
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    if (toggleButton) toggleButton.textContent = "☀️";
  }

  toggleButton?.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    toggleButton.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  /* ===== PAGE FADE TRANSITION ===== */
  document.querySelectorAll("a[href]").forEach(link => {
    if (link.getAttribute("target") === "_blank" || link.href.includes("#")) return;

    link.addEventListener("click", e => {
      e.preventDefault();
      body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = link.href;
      }, 400);
    });
  });
});