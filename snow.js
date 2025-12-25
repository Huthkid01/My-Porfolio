// Snow effect – December only
const snowContainer = document.getElementById("snow");

// Check if current month is December (0 = Jan, 11 = Dec)
const isDecember = new Date().getMonth() === 11;

if (snowContainer && isDecember) {
  function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent = "❄";

    // Random position, size, speed, opacity
    snowflake.style.left = Math.random() * window.innerWidth + "px";
    snowflake.style.fontSize = Math.random() * 10 + 12 + "px";
    snowflake.style.animationDuration = Math.random() * 5 + 5 + "s";
    snowflake.style.opacity = Math.random();

    snowContainer.appendChild(snowflake);

    // Remove snowflake after it falls
    setTimeout(() => {
      snowflake.remove();
    }, 10000);
  }

  // Create snowflakes continuously
  setInterval(createSnowflake, 200);
}