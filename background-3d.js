/**
 * Hero 3D particle network — loads after page is idle (faster first paint).
 * Autonomous motion only (no cursor / touch tracking).
 */
(function () {
    const heroBg = document.getElementById('hero-bg-3d');
    if (!heroBg) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let vantaEffect = null;
    let scriptsLoaded = false;
    let bootScheduled = false;

    function shouldRun3D() {
        if (motionQuery.matches) return false;
        if (window.innerWidth < 360) return false;
        return true;
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }

    function destroyEffect() {
        if (vantaEffect && typeof vantaEffect.destroy === 'function') {
            vantaEffect.destroy();
        }
        vantaEffect = null;
    }

    function initEffect() {
        if (!shouldRun3D() || !window.VANTA || !heroBg.isConnected) {
            destroyEffect();
            heroBg.classList.remove('is-active');
            return;
        }

        const isMobile = window.innerWidth <= 768;

        destroyEffect();

        vantaEffect = window.VANTA.NET({
            el: heroBg,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 0.85,
            color: 0x38bdf8,
            backgroundColor: 0x0f0f23,
            points: isMobile ? 6 : 9,
            maxDistance: isMobile ? 16 : 22,
            spacing: isMobile ? 18 : 14,
        });

        heroBg.classList.add('is-active');
    }

    async function boot() {
        if (!shouldRun3D()) return;

        try {
            if (!scriptsLoaded) {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
                await loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js');
                scriptsLoaded = true;
            }
            initEffect();
        } catch (err) {
            console.warn('3D hero background could not load:', err);
            heroBg.classList.remove('is-active');
        }
    }

    function scheduleBoot() {
        if (bootScheduled || !shouldRun3D()) return;
        bootScheduled = true;

        const run = () => boot();

        if ('requestIdleCallback' in window) {
            requestIdleCallback(run, { timeout: 3000 });
        } else {
            window.addEventListener('load', () => setTimeout(run, 600), { once: true });
        }
    }

    function onMotionChange() {
        if (motionQuery.matches) {
            destroyEffect();
            heroBg.classList.remove('is-active');
        } else {
            scheduleBoot();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleBoot, { once: true });
    } else {
        scheduleBoot();
    }

    if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', onMotionChange);
    } else if (motionQuery.addListener) {
        motionQuery.addListener(onMotionChange);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!shouldRun3D()) {
                destroyEffect();
                heroBg.classList.remove('is-active');
                return;
            }
            if (vantaEffect) {
                initEffect();
            } else {
                scheduleBoot();
            }
        }, 300);
    });
})();
