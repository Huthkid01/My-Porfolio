/**
 * Hero 3D particle network — full-bleed behind hero, autonomous motion.
 */
(function () {
    const heroBg = document.getElementById('hero-bg-3d');
    const heroSection = document.querySelector('.hero');
    if (!heroBg || !heroSection) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let vantaEffect = null;
    let scriptsLoaded = false;
    let bootScheduled = false;
    let resizeObserver = null;

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

    function syncBgSize() {
        const w = heroSection.offsetWidth;
        const h = heroSection.offsetHeight;
        if (w > 0 && h > 0) {
            heroBg.style.width = `${w}px`;
            heroBg.style.height = `${h}px`;
        }
    }

    function resizeEffect() {
        syncBgSize();
        if (vantaEffect && typeof vantaEffect.resize === 'function') {
            vantaEffect.resize();
        }
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

        syncBgSize();
        destroyEffect();

        vantaEffect = window.VANTA.NET({
            el: heroBg,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 1,
            color: 0x38bdf8,
            backgroundColor: 0x0f0f23,
            points: isMobile ? 7 : 10,
            maxDistance: isMobile ? 20 : 26,
            spacing: isMobile ? 17 : 14,
        });

        heroBg.classList.add('is-active');

        requestAnimationFrame(() => {
            requestAnimationFrame(resizeEffect);
        });
    }

    function watchHeroResize() {
        if (resizeObserver || !window.ResizeObserver) return;

        resizeObserver = new ResizeObserver(() => {
            if (vantaEffect) {
                resizeEffect();
            }
        });
        resizeObserver.observe(heroSection);
    }

    async function boot() {
        if (!shouldRun3D()) return;

        try {
            syncBgSize();

            if (!scriptsLoaded) {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
                await loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js');
                scriptsLoaded = true;
            }

            if (document.fonts && document.fonts.ready) {
                await document.fonts.ready;
            }

            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

            initEffect();
            watchHeroResize();
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
            requestIdleCallback(run, { timeout: 2500 });
        } else {
            window.addEventListener('load', () => setTimeout(run, 400), { once: true });
        }
    }

    function onMotionChange() {
        if (motionQuery.matches) {
            destroyEffect();
            heroBg.classList.remove('is-active');
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        } else {
            scheduleBoot();
        }
    }

    window.addEventListener('load', () => {
        if (vantaEffect) resizeEffect();
    }, { once: true });

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
                resizeEffect();
            } else {
                bootScheduled = false;
                scheduleBoot();
            }
        }, 200);
    });
})();
