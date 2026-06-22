/**
 * Joto-style portfolio interactions
 */
(function () {
    'use strict';

    const SLIDE_DURATION = 6300;
    let heroSwiper = null;
    let progressTimer = null;

    /* ——— Utilities ——— */
    function $(sel, ctx = document) {
        return ctx.querySelector(sel);
    }

    function $$(sel, ctx = document) {
        return Array.from(ctx.querySelectorAll(sel));
    }

    /* ——— Lenis smooth scroll ——— */
    let lenis = null;
    function initLenis() {
        if (typeof Lenis === 'undefined') return;
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* ——— Offcanvas nav ——— */
    function initOffcanvas() {
        const offcanvas = $('.offcanvas-nav');
        const menu = $('.offcanvas-menu');
        const openBtn = $('.open-offcanvas-nav');
        const closeBtn = $('.close-offcanvas-menu');

        if (!offcanvas || !menu || !openBtn) return;

        const open = () => {
            offcanvas.classList.add('active');
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        };

        const close = () => {
            offcanvas.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        };

        openBtn.addEventListener('click', open);
        closeBtn?.addEventListener('click', close);
        offcanvas.addEventListener('click', (e) => {
            if (e.target === offcanvas) close();
        });
        $$('.offcanvas-menu a').forEach((link) => link.addEventListener('click', close));
    }

    /* ——— Hero slider + progress ——— */
    function resetProgressBars() {
        $$('.banner-three__slider-progress .inProgress').forEach((bar) => {
            bar.style.animation = 'none';
            void bar.offsetWidth;
            bar.style.animation = '';
        });
    }

    function setActiveProgress(index) {
        $$('.banner-three__slider-progress .single-item').forEach((item, i) => {
            item.classList.toggle('single-item-active', i === index);
        });
        resetProgressBars();
    }

    function initHeroSlider() {
        if (typeof Swiper === 'undefined') return;

        const progressItems = $$('.banner-three__slider-progress .single-item');

        heroSwiper = new Swiper('.banner-three__slider', {
            loop: true,
            speed: 900,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            autoplay: {
                delay: SLIDE_DURATION,
                disableOnInteraction: false,
            },
            on: {
                init(swiper) {
                    setActiveProgress(swiper.realIndex);
                },
                slideChange(swiper) {
                    setActiveProgress(swiper.realIndex);
                },
            },
        });

        progressItems.forEach((item) => {
            item.addEventListener('click', () => {
                const index = Number(item.dataset.slide);
                if (Number.isNaN(index)) return;
                heroSwiper.slideToLoop(index);
                setActiveProgress(index);
            });
        });
    }

    /* ——— Services accordion ——— */
    function initServices() {
        $$('.service-f-single').forEach((item) => {
            const toggle = $('.toggle-service-f', item);
            const activate = () => {
                $$('.service-f-single').forEach((el) => {
                    if (el !== item) el.classList.remove('service-f-single-active');
                });
                item.classList.toggle('service-f-single-active');
            };
            toggle?.addEventListener('click', activate);
            $('.single-item h4', item)?.addEventListener('click', activate);
        });
    }

    /* ——— Portfolio sliders ——— */
    function initPortfolio() {
        if (typeof Swiper === 'undefined') return;

        new Swiper('.portfolio__text-slider', {
            slidesPerView: 'auto',
            spaceBetween: 40,
            loop: true,
            speed: 8000,
            autoplay: { delay: 0, disableOnInteraction: false },
            allowTouchMove: false,
        });

        const portfolioSlider = new Swiper('.portfolio-three__slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            speed: 800,
            breakpoints: {
                768: { slidesPerView: 1.2 },
                1200: { slidesPerView: 1.5 },
            },
        });

        $('.prev-portfolio')?.addEventListener('click', () => portfolioSlider.slidePrev());
        $('.next-portfolio')?.addEventListener('click', () => portfolioSlider.slideNext());

        $$('.portfolio-three .portfolio__single').forEach((card) => {
            card.addEventListener('mouseenter', () => {
                $('.cursor-inner span')?.textContent = 'Drag';
            });
            card.addEventListener('mouseleave', () => {
                $('.cursor-inner span')?.textContent = '';
            });
        });
    }

    /* ——— GSAP scroll animations ——— */
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.fade-top').forEach((el) => {
            gsap.fromTo(
                el,
                { y: 48, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                }
            );
        });

        gsap.utils.toArray('.fade-left').forEach((el) => {
            gsap.fromTo(
                el,
                { x: -60, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                }
            );
        });

        gsap.utils.toArray('.title-anim').forEach((title) => {
            const text = title.textContent.trim();
            title.innerHTML = text
                .split(' ')
                .map((word) => `<span class="word"><span class="char">${word}</span></span>`)
                .join(' ');

            gsap.from(title.querySelectorAll('.char'), {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.04,
                ease: 'power3.out',
                scrollTrigger: { trigger: title, start: 'top 88%', once: true },
            });
        });
    }

    /* ——— Custom cursor ——— */
    function initCursor() {
        if (window.matchMedia('(max-width: 991.98px)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const outer = $('.cursor-outer');
        const inner = $('.cursor-inner');
        if (!outer || !inner) return;

        let x = 0;
        let y = 0;
        let ox = 0;
        let oy = 0;

        document.addEventListener('mousemove', (e) => {
            x = e.clientX;
            y = e.clientY;
        });

        const animate = () => {
            ox += (x - ox) * 0.15;
            oy += (y - oy) * 0.15;
            outer.style.transform = `translate(${ox}px, ${oy}px)`;
            inner.style.transform = `translate(${ox}px, ${oy}px)`;
            requestAnimationFrame(animate);
        };
        animate();

        const hoverables = 'a, button, .service-f-single, .portfolio__single';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverables)) {
                outer.classList.add('cursor-hover');
                inner.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverables)) {
                outer.classList.remove('cursor-hover');
                inner.classList.remove('cursor-hover');
            }
        });
    }

    /* ——— Scroll to top ——— */
    function initScrollTop() {
        const btn = $('.progress-wrap');
        const path = $('.progress-circle path');
        if (!btn || !path) return;

        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = length;

        const update = () => {
            const scroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = length - (scroll * length) / (height || 1);
            path.style.strokeDashoffset = progress;
            btn.classList.toggle('active-progress', scroll > 120);
        };

        window.addEventListener('scroll', update, { passive: true });
        btn.addEventListener('click', () => {
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ——— EmailJS contact form ——— */
    function initContactForm() {
        const form = $('#contact-form');
        const submitBtn = $('#submit-btn');
        const formMessage = $('#form-message');
        if (!form) return;

        const EMAILJS_SRC = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        const EMAILJS_KEY = 'LFEwK23lD-5JHLuM5';
        let emailReady = null;

        function ensureEmailJS() {
            if (emailReady) return emailReady;
            emailReady = new Promise((resolve, reject) => {
                if (window.emailjs) {
                    window.emailjs.init(EMAILJS_KEY);
                    resolve(window.emailjs);
                    return;
                }
                const s = document.createElement('script');
                s.src = EMAILJS_SRC;
                s.async = true;
                s.onload = () => {
                    window.emailjs.init(EMAILJS_KEY);
                    resolve(window.emailjs);
                };
                s.onerror = reject;
                document.head.appendChild(s);
            });
            return emailReady;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.style.color = '#ff7425';
                return;
            }
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            try {
                const emailjs = await ensureEmailJS();
                await emailjs.send('service_sq8q7zl', 'template_6dhntle', {
                    name,
                    email,
                    message,
                    date_time: new Date().toLocaleString(),
                });
                formMessage.textContent = 'Message sent — I will reply soon.';
                formMessage.style.color = '#4ade80';
                form.reset();
            } catch (err) {
                console.error(err);
                formMessage.textContent = 'Failed to send. Please try again or email me directly.';
                formMessage.style.color = '#f87171';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }

    /* ——— Footer year ——— */
    function initFooter() {
        const year = $('#copyYear');
        if (year) year.textContent = new Date().getFullYear();
    }

    /* ——— Init ——— */
    document.addEventListener('DOMContentLoaded', () => {
        initLenis();
        initOffcanvas();
        initHeroSlider();
        initServices();
        initPortfolio();
        initScrollAnimations();
        initCursor();
        initScrollTop();
        initContactForm();
        initFooter();
    });
})();
