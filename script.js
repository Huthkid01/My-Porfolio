// Toggle collapsible sections
document.querySelectorAll('.view-more-arrow').forEach(arrow => {
    if (arrow.id === 'skills-toggle') {
        // Special handling for skills
        arrow.addEventListener('click', () => {
            const hiddenSkills = document.querySelectorAll('.hidden-skill');
            const isHidden = hiddenSkills[0].style.display === 'none' || hiddenSkills[0].style.display === '';
            hiddenSkills.forEach(skill => {
                skill.style.display = isHidden ? 'flex' : 'none';
            });
            arrow.textContent = isHidden ? '▲ View Less' : '▼ View More';
        });
    } else {
        // Regular collapsible
        arrow.addEventListener('click', () => {
            const target = document.getElementById(arrow.dataset.target);
            const section = arrow.closest('section');
            if (target.style.display === 'none' || target.style.display === '') {
                target.style.display = 'block';
                arrow.textContent = '▲ View Less';
            } else {
                target.style.display = 'none';
                arrow.textContent = '▼ View More';
                if (section) {
                    requestAnimationFrame(() => {
                        const headerHeight = parseFloat(
                            getComputedStyle(document.documentElement).getPropertyValue('--header-height')
                        ) || 96;
                        const top = section.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
                    });
                }
            }
        });
    }
});

// Fast loader — hide as soon as DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;

    loader.classList.add('hide');
    setTimeout(() => {
        loader.remove();
    }, 180);
});

document.addEventListener('DOMContentLoaded', () => {
    const skillsScroll = document.querySelector('.skills-scroll');
    if (!skillsScroll) return;
    if (skillsScroll.dataset.duplicated === 'true') return;
    const items = Array.from(skillsScroll.children);
    if (items.length === 0) return;
    items.forEach(item => {
        skillsScroll.appendChild(item.cloneNode(true));
    });
    skillsScroll.dataset.duplicated = 'true';
});


const updateHeaderHeight = () => {
    const header = document.querySelector('header');
    if (!header) return;
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
};

updateHeaderHeight();

document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(updateHeaderHeight);
    requestAnimationFrame(() => requestAnimationFrame(updateHeaderHeight));
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => requestAnimationFrame(updateHeaderHeight));
    }
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('load', updateHeaderHeight);
});

const setRoundFavicon = () => {
    const faviconLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    if (faviconLinks.length === 0) return;
    const img = new Image();
    img.src = 'images/myimage.png';
    img.onload = () => {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/png');
        faviconLinks.forEach(link => {
            link.href = dataUrl;
            link.type = 'image/png';
        });
    };
};

document.addEventListener('DOMContentLoaded', () => {
    setRoundFavicon();
});

// Customer Support Chat Widget
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input-text');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.querySelector('.chat-messages');

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close chat window
    chatClose.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessage(message, 'user');

            // Clear input
            chatInput.value = '';

            // Directly open WhatsApp with the user's message
            const whatsappUrl = `https://wa.me/2348144170968?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    // Add message to chat
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send on button click
    chatSend.addEventListener('click', sendMessage);

    // Send on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

// Hero image flip toggle
document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.querySelector('.hero-image img');
    if (heroImg) {
        heroImg.addEventListener('click', () => {
            heroImg.classList.toggle('flipped');
        });
        heroImg.addEventListener('touchstart', () => {
            heroImg.classList.toggle('flipped');
        });
    }
});

// Load More Projects - Mobile Only
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const projectsSection = document.getElementById('projects');
    const loadMoreContainer = projectsSection ? projectsSection.querySelector('.load-more-container') : null;
    const projectCards = projectsSection ? projectsSection.querySelectorAll('.projects-grid .project-card') : [];

    if (!loadMoreBtn || !loadMoreContainer || projectCards.length === 0) {
        return;
    }

    const MOBILE_BREAKPOINT = 768;
    const MOBILE_VISIBLE_COUNT = 4;
    let isProjectsExpanded = false;
    let lastWasMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    function isMobileView() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function revealProjectCard(card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }

    function scrollToSectionTop(section) {
        requestAnimationFrame(() => {
            const headerHeight = parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue('--header-height')
            ) || 96;
            const top = section.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        });
    }

    function applyProjectsVisibility() {
        if (!isMobileView()) {
            isProjectsExpanded = false;
            projectCards.forEach(card => {
                card.style.display = 'block';
            });
            loadMoreContainer.style.display = 'none';
            return;
        }

        if (projectCards.length <= MOBILE_VISIBLE_COUNT) {
            projectCards.forEach(card => {
                card.style.display = 'block';
                revealProjectCard(card);
            });
            loadMoreContainer.style.display = 'none';
            return;
        }

        projectCards.forEach((card, index) => {
            const shouldShow = isProjectsExpanded || index < MOBILE_VISIBLE_COUNT;
            card.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) {
                revealProjectCard(card);
            }
        });

        loadMoreContainer.style.display = 'block';
        loadMoreBtn.textContent = isProjectsExpanded ? 'View Less' : 'View More';
    }

    loadMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const wasExpanded = isProjectsExpanded;
        isProjectsExpanded = !isProjectsExpanded;
        applyProjectsVisibility();

        // Collapsing shrinks the page but scroll position stays put — scroll back to projects
        if (wasExpanded && !isProjectsExpanded) {
            scrollToSectionTop(projectsSection);
        }
    });

    applyProjectsVisibility();

    // Only reset collapse state when crossing the mobile/desktop breakpoint
    window.addEventListener('resize', () => {
        const nowMobile = isMobileView();
        if (nowMobile !== lastWasMobile) {
            if (!nowMobile) {
                isProjectsExpanded = false;
            }
            lastWasMobile = nowMobile;
        }
        applyProjectsVisibility();
    });
});

// Scroll to top on refresh
window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
});



// Back to top button with arrow
const backToTopBtn = document.getElementById('back-to-top-text');
const contactSection = document.getElementById('contact');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const contactTop = contactSection.offsetTop;

    // Show when scrolled past contact section
    if (scrollTop > contactTop) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Keyboard support for hamburger
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        if (hamburger && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// EmailJS — load only when the contact form is used (faster initial page load)
const EMAILJS_SRC = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
const EMAILJS_PUBLIC_KEY = 'LFEwK23lD-5JHLuM5';
let emailJsReady = null;

function ensureEmailJS() {
    if (emailJsReady) return emailJsReady;

    emailJsReady = new Promise((resolve, reject) => {
        if (window.emailjs) {
            window.emailjs.init(EMAILJS_PUBLIC_KEY);
            resolve(window.emailjs);
            return;
        }

        const script = document.createElement('script');
        script.src = EMAILJS_SRC;
        script.async = true;
        script.onload = () => {
            window.emailjs.init(EMAILJS_PUBLIC_KEY);
            resolve(window.emailjs);
        };
        script.onerror = () => reject(new Error('EmailJS failed to load'));
        document.head.appendChild(script);
    });

    return emailJsReady;
}

const contactForm = document.querySelector('form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const message = this.querySelector('textarea').value.trim();

        if (name && email && message) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formMessage.style.display = 'none';

            try {
                const emailjs = await ensureEmailJS();
                await emailjs.send('service_sq8q7zl', 'template_6dhntle', {
                    name: name,
                    email: email,
                    message: message,
                    date_time: new Date().toLocaleString()
                });

                alert('Your message has been sent successfully!');
                formMessage.style.display = 'block';
                formMessage.style.backgroundColor = '#d4edda';
                formMessage.style.color = '#155724';
                formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                contactForm.reset();
            } catch (error) {
                console.error('EmailJS error:', error);
                alert('Failed to send message. Please check your connection and try again.');
                formMessage.style.display = 'block';
                formMessage.style.backgroundColor = '#f8d7da';
                formMessage.style.color = '#721c24';
                formMessage.textContent = 'Failed to send message. Please try again.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        } else {
            formMessage.style.display = 'block';
            formMessage.style.backgroundColor = '#fff3cd';
            formMessage.style.color = '#856404';
            formMessage.textContent = 'Please fill in all fields.';
        }
    });
}

// Update copyright year dynamically
const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// No background cycling needed

// Mobile touch feedback for skills
const skills = document.querySelectorAll('.skill');
skills.forEach(skill => {
    skill.addEventListener('touchstart', () => {
        skill.classList.add('touch-active');
    });
    skill.addEventListener('touchend', () => {
        skill.classList.remove('touch-active');
    });
});

// Typewriter effect for hero text
const highlightElement = document.querySelector('.highlight');
const h2Element = document.querySelector('.hero-content h2');

if (highlightElement) {
    const highlightText = 'Odusanya Uthman';
    highlightElement.textContent = '';
    let index = 0;
    const typeHighlight = () => {
        if (index < highlightText.length) {
            highlightElement.textContent += highlightText.charAt(index);
            index++;
            setTimeout(typeHighlight, 100);
        }
    };
    setTimeout(typeHighlight, 500); // Start after 0.5s
}

if (h2Element) {
    const h2Text = 'Full-Stack Web Developer';
    h2Element.textContent = '';
    let index2 = 0;
    const typeH2 = () => {
        if (index2 < h2Text.length) {
            h2Element.textContent += h2Text.charAt(index2);
            index2++;
            setTimeout(typeH2, 100);
        }
    };
    setTimeout(typeH2, 1000); // Start after 1s
}

// Image modal functionality
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');

document.querySelectorAll('.project-image img').forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = img.src;
        modalImg.alt = img.alt;
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Keyboard support for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const resumeBtn = document.getElementById('resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const closeResumeModal = document.getElementById('close-resume-modal');
    const resumeFrame = document.getElementById('resume-frame');

    if (!resumeBtn || !resumeModal || !closeResumeModal || !resumeFrame) {
        return;
    }

    let lastActiveElement = null;

    const openResumeModal = () => {
        lastActiveElement = document.activeElement;
        resumeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (!resumeFrame.getAttribute('src')) {
            resumeFrame.setAttribute('src', 'images/Uthman_Odusanya_Resume.pdf');
        }
        closeResumeModal.focus();
    };

    const closeResume = () => {
        resumeModal.style.display = 'none';
        document.body.style.overflow = '';
        if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
            lastActiveElement.focus();
        }
    };

    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openResumeModal();
    });

    closeResumeModal.addEventListener('click', closeResume);

    resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) {
            closeResume();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.style.display === 'flex') {
            closeResume();
        }
    });
});

// Scroll animations — deferred so hero and content show faster
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const staticSections = new Set(['home', 'services']);

    document.querySelectorAll('section').forEach(section => {
        if (staticSections.has(section.id)) {
            section.style.opacity = '1';
            section.style.transform = 'none';
            return;
        }
        section.style.opacity = '0';
        section.style.transform = 'translateY(24px)';
        section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(section);
    });

    document.querySelectorAll('section:not(#home):not(#services) h2, section:not(#home):not(#services) h3').forEach(heading => {
        heading.style.opacity = '0';
        heading.style.transform = 'translateY(16px)';
        heading.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
        observer.observe(heading);
    });

    document.querySelectorAll('.skill').forEach(skill => {
        skill.style.opacity = '0';
        skill.style.transform = 'translateY(16px)';
        skill.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        observer.observe(skill);
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(card);
    });

    // Services cards: always visible (no nested opacity — fixes broken mobile layout)
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
}

if ('requestIdleCallback' in window) {
    requestIdleCallback(initScrollAnimations, { timeout: 1500 });
} else {
    setTimeout(initScrollAnimations, 50);
}
