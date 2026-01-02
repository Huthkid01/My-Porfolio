document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("snow");
  if (!container) return;

  const today = new Date();
  const month = today.getMonth(); // 0 = Jan, 11 = Dec
  const day = today.getDate();
  const isMobile = window.innerWidth <= 480;

  /* =========================
     DECEMBER SNOW
  ========================== */
  if (month === 11) { // December
    const interval = isMobile ? 450 : 200;

    function createSnowflake() {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";
      snowflake.textContent = "❄";

      const size = isMobile ? Math.random() * 6 + 6 : Math.random() * 10 + 12;
      snowflake.style.left = Math.random() * window.innerWidth + "px";
      snowflake.style.fontSize = size + "px";
      snowflake.style.opacity = Math.random();
      snowflake.style.animationDuration = Math.random() * 5 + 5 + "s";

      container.appendChild(snowflake);
      setTimeout(() => snowflake.remove(), 12000);
    }

    setInterval(createSnowflake, interval);
  }

  /* =========================
     NEW YEAR FIREWORKS
     Jan 1 – Jan 3
  ========================== */
  if (month === 0 && day <= 3) {
    const fireworkInterval = isMobile ? 1200 : 800;

    function createFirework() {
      const firework = document.createElement("div");
      firework.className = "firework";
      firework.style.left = Math.random() * window.innerWidth + "px";
      firework.style.top = Math.random() * window.innerHeight * 0.5 + "px";
      container.appendChild(firework);

      for (let i = 0; i < 24; i++) {
        const spark = document.createElement("span");
        spark.className = "spark";

        const angle = Math.random() * Math.PI * 2; // radians
        const distance = Math.random() * 80 + 40;

        spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
        spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
        spark.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;

        firework.appendChild(spark);
      }

      setTimeout(() => firework.remove(), 1300);
    }

    setInterval(createFirework, fireworkInterval);
  }

  /* =========================
     FIREWORK STYLES
  ========================== */
  const style = document.createElement("style");
  style.textContent = `
    .firework {
      position: absolute;
      width: 6px;
      height: 6px;
      z-index: 10000;
    }

    .spark {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      animation: explode 1.3s ease-out forwards;
    }

    @keyframes explode {
      from {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      to {
        transform: translate(var(--x), var(--y)) scale(0.3);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});
