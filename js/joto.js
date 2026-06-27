/**
 * Joto-style interactions — matched to https://www.joto.team/
 */
(function () {
    'use strict';

    /* Offcanvas */
    (function initOffcanvas() {
        const menu = document.querySelector('.offcanvas-menu');
        const openBtn = document.querySelector('.open-offcanvas-nav');
        const closeBtn = document.querySelector('.close-offcanvas-menu');
        if (!menu || !openBtn) return;

        const open = () => {
            menu.classList.add('show-offcanvas-menu');
            document.body.style.overflow = 'hidden';
        };
        const close = () => {
            menu.classList.remove('show-offcanvas-menu');
            document.body.style.overflow = '';
        };

        openBtn.addEventListener('click', open);
        closeBtn?.addEventListener('click', close);
        menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
        window.addEventListener('resize', close);
    })();

    /* Smooth anchor scroll (native — Joto does not use Lenis) */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* Hero slider + progress tabs */
    let heroSwiper = null;

    function loadHeroSlideBg(slideEl) {
        const single = slideEl?.querySelector('.banner-three__slider-single');
        if (!single || single.dataset.bgLoaded) return;
        const url = single.dataset.bg;
        if (!url) return;
        single.style.backgroundImage = `url('${url}')`;
        single.dataset.bgLoaded = '1';
    }

    function preloadRemainingHeroSlides(swiper) {
        swiper.slides.forEach((slide) => loadHeroSlideBg(slide));
    }

    function setActiveTab(index, progressMs) {
        const items = document.querySelectorAll('.banner-three__slider-progress .single-item');
        items.forEach((el) => el.classList.remove('single-item-active'));
        const active = items[index];
        if (!active) return;
        void active.offsetWidth;
        active.classList.add('single-item-active');
        if (progressMs) {
            const bar = active.querySelector('.slider-progress');
            if (bar) bar.style.setProperty('--hero-progress-ms', `${progressMs}ms`);
        }
    }

    const HERO_HOLD_AFTER_TYPE = 2800;
    const TYPE_CHAR_MS = 42;
    const TYPE_WORD_PAUSE_MS = 120;

    let heroTypeTimer = null;
    let heroAdvanceTimer = null;

    function estimateTypingMs(text) {
        const words = text.split(/\s+/).filter(Boolean);
        return words.reduce((sum, word) => (
            sum + word.length * TYPE_CHAR_MS + TYPE_WORD_PAUSE_MS
        ), 200);
    }

    function cacheHeroTitles(swiper) {
        swiper.slides.forEach((slide) => {
            const h1 = slide.querySelector('.banner-three__content h1.hero-typewriter');
            if (h1 && !h1.dataset.typewriterText) {
                h1.dataset.typewriterText = h1.textContent.trim();
            }
        });
    }

    function clearHeroTimers() {
        if (heroTypeTimer) {
            clearTimeout(heroTypeTimer);
            heroTypeTimer = null;
        }
        if (heroAdvanceTimer) {
            clearTimeout(heroAdvanceTimer);
            heroAdvanceTimer = null;
        }
    }

    function getActiveHeroTitle(swiper) {
        return swiper.slides[swiper.activeIndex]?.querySelector('.banner-three__content h1.hero-typewriter') || null;
    }

    function typeHeroTitle(h1, onComplete) {
        if (!h1) {
            onComplete?.();
            return;
        }

        clearHeroTimers();

        const fullText = h1.dataset.typewriterText || h1.textContent.trim();
        h1.dataset.typewriterText = fullText;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            h1.innerHTML = fullText.split(/\s+/).map((word) => (
                `<span class="hero-typewriter__word">${word}</span>`
            )).join(' ');
            onComplete?.();
            return;
        }

        const words = fullText.split(/\s+/).filter(Boolean);
        h1.innerHTML = words.map(() => '<span class="hero-typewriter__word"></span>').join('')
            + '<span class="hero-typewriter__cursor" aria-hidden="true">|</span>';

        const wordEls = h1.querySelectorAll('.hero-typewriter__word');
        const cursor = h1.querySelector('.hero-typewriter__cursor');
        let wordIndex = 0;
        let charIndex = 0;

        const step = () => {
            if (wordIndex >= words.length) {
                cursor?.remove();
                heroTypeTimer = null;
                onComplete?.();
                return;
            }

            const word = words[wordIndex];
            wordEls[wordIndex].textContent = word.slice(0, charIndex + 1);
            charIndex += 1;

            if (charIndex >= word.length) {
                wordIndex += 1;
                charIndex = 0;
                heroTypeTimer = setTimeout(step, TYPE_WORD_PAUSE_MS);
            } else {
                heroTypeTimer = setTimeout(step, TYPE_CHAR_MS);
            }
        };

        step();
    }

    function runHeroSlideCycle(swiper) {
        clearHeroTimers();
        setActiveTab(swiper.realIndex);

        const h1 = getActiveHeroTitle(swiper);
        const text = h1?.dataset.typewriterText || h1?.textContent.trim() || '';
        const typeMs = estimateTypingMs(text);
        const totalMs = typeMs + HERO_HOLD_AFTER_TYPE;

        setActiveTab(swiper.realIndex, totalMs);
        loadHeroSlideBg(swiper.slides[swiper.activeIndex]);

        typeHeroTitle(h1, () => {
            heroAdvanceTimer = setTimeout(() => {
                swiper.slideNext();
            }, HERO_HOLD_AFTER_TYPE);
        });
    }

    if (typeof Swiper !== 'undefined') {
        heroSwiper = new Swiper('.banner-three__slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            speed: 1000,
            centeredSlides: true,
            autoplay: false,
            on: {
                init(sw) {
                    cacheHeroTitles(sw);
                    runHeroSlideCycle(sw);
                    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
                    schedule(() => preloadRemainingHeroSlides(sw));
                },
                slideChangeTransitionEnd(sw) {
                    runHeroSlideCycle(sw);
                },
            },
        });

        document.querySelectorAll('.banner-three__slider-progress .single-item').forEach((tab, idx) => {
            tab.addEventListener('click', () => {
                clearHeroTimers();
                heroSwiper.slideToLoop(idx);
            });
        });
    }

    /* Services accordion — one open at a time, toggle closes active */
    document.querySelectorAll('.service-f-single').forEach((item) => {
        item.querySelector('.toggle-service-f')?.addEventListener('click', () => {
            const isActive = item.classList.contains('service-f-single-active');
            document.querySelectorAll('.service-f-single').forEach((el) => {
                el.classList.remove('service-f-single-active');
            });
            if (!isActive) item.classList.add('service-f-single-active');
        });
    });

    /* Portfolio sliders */
    if (typeof Swiper !== 'undefined') {
        new Swiper('.portfolio__text-slider', {
            slidesPerView: 'auto',
            spaceBetween: 40,
            loop: true,
            speed: 5000,
            centeredSlides: true,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
        });

        new Swiper('.portfolio-three__slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            slidesPerGroup: 1,
            loop: true,
            speed: 800,
            centeredSlides: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            navigation: {
                nextEl: '.next-portfolio',
                prevEl: '.prev-portfolio',
            },
            breakpoints: {
                576: { slidesPerView: 1.5 },
                992: { slidesPerView: 2 },
            },
        });
    }

    /* VanillaTilt on portfolio cards */
    if (typeof VanillaTilt !== 'undefined') {
        document.querySelectorAll('.topy-tilt').forEach((el) => {
            VanillaTilt.init(el, { max: 5, speed: 3000 });
        });
    }

    /* GSAP scroll animations */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll('.fade-wrapper').forEach((wrapper) => {
            wrapper.querySelectorAll('.fade-top').forEach((el, i) => {
                const delay = 0.15 * i;
                gsap.set(el, { opacity: 0, y: 100 });
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 100%',
                    end: 'bottom 20%',
                    scrub: 0.5,
                    onEnter: () => {
                        gsap.to(el, { opacity: 1, y: 0, duration: 1, delay });
                    },
                    once: true,
                });
            });
        });

        gsap.utils.toArray('.fade-left').forEach((el) => {
            gsap.fromTo(el, { x: -80, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
        });

        document.querySelectorAll('.title-anim').forEach((title) => {
            if (title.dataset.split) return;
            title.dataset.split = '1';
            const text = title.textContent.trim();

            title.innerHTML = text.split(/\s+/).filter(Boolean).map((word) => {
                const chars = word.split('').map((ch) => `<span class="char">${ch}</span>`).join('');
                return `<span class="word">${chars}</span>`;
            }).join(' ');

            title.querySelectorAll('.char').forEach((char, i) => {
                gsap.from(char, {
                    duration: 0.8,
                    x: 70,
                    autoAlpha: 0,
                    delay: 0.03 * i,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                });
            });
        });

        window.addEventListener('load', () => ScrollTrigger.refresh());
    }

    /* Custom cursor */
    if (window.matchMedia('(min-width: 992px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const outer = document.querySelector('.cursor-outer');
        const inner = document.querySelector('.cursor-inner');

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            if (outer) outer.style.transform = `translate(${x}px, ${y}px)`;
            if (inner) inner.style.transform = `translate(${x}px, ${y}px)`;
        });

        document.querySelectorAll('a, button').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                outer?.classList.add('cursor-hover');
                inner?.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                outer?.classList.remove('cursor-hover');
                inner?.classList.remove('cursor-hover');
            });
        });

        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((el) => {
            el.addEventListener('mouseover', () => {
                outer?.classList.add('cursor-big');
                inner?.classList.add('cursor-big');
            });
            el.addEventListener('mouseout', () => {
                outer?.classList.remove('cursor-big');
                inner?.classList.remove('cursor-big');
            });
        });
    }

    /* Scroll to top */
    (function initScrollTop() {
        const btn = document.querySelector('.progress-wrap');
        const path = document.querySelector('.progress-circle path');
        if (!btn || !path) return;
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = len;
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            const h = document.documentElement.scrollHeight - window.innerHeight;
            path.style.strokeDashoffset = len - (scroll * len) / (h || 1);
            btn.classList.toggle('active-progress', scroll > 50);
        }, { passive: true });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    const year = document.getElementById('copyYear');
    if (year) year.textContent = new Date().getFullYear();
})();
