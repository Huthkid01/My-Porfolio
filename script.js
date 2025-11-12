const toggleButton = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  toggleButton.textContent = "☀️";
}

toggleButton?.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  toggleButton.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Page fade transition
const links = document.querySelectorAll("a[href]");
links.forEach(link => {
  if (link.getAttribute("target") === "_blank") return;
  link.addEventListener("click", e => {
    e.preventDefault();
    const href = link.getAttribute("href");
    body.classList.add("fade-out");
    setTimeout(() => window.location.href = href, 500);
  });
});