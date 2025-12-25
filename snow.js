// Snow effect – December only
const snowContainer = document.getElementById("snow");

// Only show snow in December
const isDecember = new Date().getMonth() === 11;

if (snowContainer && isDecember) {
  // Detect mobile
  const isMobile = window.innerWidth <= 480;
  const intervalTime = isMobile ? 400 : 200; // slower on mobile

  function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent = "❄";

    // Random position, size, speed, opacity
    const size = isMobile ? Math.random() * 6 + 6 : Math.random() * 10 + 12;
    snowflake.style.left = Math.random() * window.innerWidth + "px";
    snowflake.style.fontSize = size + "px";
    snowflake.style.animationDuration = Math.random() * 5 + 5 + "s";
    snowflake.style.opacity = Math.random();

    snowContainer.appendChild(snowflake);

    // Remove snowflake after it falls
    setTimeout(() => snowflake.remove(), 10000);
  }

  // Continuously create snowflakes
  setInterval(createSnowflake, intervalTime);

  // Update snow on window resize (optional)
  window.addEventListener("resize", () => {
    // Nothing to change, flakes are already dynamic
  });
}