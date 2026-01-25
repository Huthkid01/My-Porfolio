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
            if (target.style.display === 'none' || target.style.display === '') {
                target.style.display = 'block';
                arrow.textContent = '▲ View Less';
            } else {
                target.style.display = 'none';
                arrow.textContent = '▼ View More';
            }
        });
    }
});

// Optimized Loading screen - faster and more efficient
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');

    // Hide loader immediately when DOM is ready (faster than window.load)
    loader.classList.add('hide');

    // Remove from DOM after transition for better performance
    setTimeout(() => {
        loader.style.display = 'none';
    }, 300); // Match CSS transition duration
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
    const loadMoreContainer = document.querySelector('.load-more-container');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    // Function to check if we're on mobile view
    function isMobileView() {
        return window.innerWidth <= 768; // Typical mobile breakpoint
    }

    // Function to handle mobile project display
    function handleMobileProjects() {
        if (isMobileView()) {
            // On mobile: show only first 4 projects initially, hide the rest
            const mobileVisibleCount = 4;

            // Hide all projects first
            projectCards.forEach((card, index) => {
                if (index < mobileVisibleCount) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            // Show view more button
            loadMoreContainer.style.display = 'block';
            loadMoreBtn.textContent = 'View More';
        } else {
            // On desktop: show ALL projects immediately
            projectCards.forEach(card => {
                card.style.display = 'block';
            });

            // Hide load more button on desktop
            loadMoreContainer.style.display = 'none';
        }
    }

    // View More/Less button click handler
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const isShowingAll = projectCards[4].style.display === 'block';

            if (isShowingAll) {
                // View Less: Show only first 4 projects
                projectCards.forEach((card, index) => {
                    if (index < 4) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                loadMoreBtn.textContent = 'View More';
            } else {
                // View More: Show all projects
                projectCards.forEach(card => {
                    card.style.display = 'block';
                });
                loadMoreBtn.textContent = 'View Less';
            }
        });
    }

    // Initialize on page load
    handleMobileProjects();

    // Update on window resize
    window.addEventListener('resize', handleMobileProjects);
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

// Initialize EmailJS with your public key
emailjs.init('LFEwK23lD-5JHLuM5');
// Form submission handling with EmailJS
const contactForm = document.querySelector('form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simple validation
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const message = this.querySelector('textarea').value.trim();

        if (name && email && message) {
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formMessage.style.display = 'none';

            // Send email using EmailJS
            emailjs.send('service_sq8q7zl', 'template_6dhntle', {
                name: name,
                email: email,
                message: message,
                date_time: new Date().toLocaleString()
            }).then(function(response) {
                alert('Your message has been sent successfully!');
                formMessage.style.display = 'block';
                formMessage.style.backgroundColor = '#d4edda';
                formMessage.style.color = '#155724';
                formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }, function(error) {
                console.error('EmailJS error:', error);
                alert('Failed to send message. Please check your connection and try again.');
                formMessage.style.display = 'block';
                formMessage.style.backgroundColor = '#f8d7da';
                formMessage.style.color = '#721c24';
                formMessage.textContent = 'Failed to send message. Please try again.';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
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
    const h2Text = 'Frontend Web Developer';
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

// Scroll-triggered animations for sections, headings, and elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate sections
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Animate headings
const headings = document.querySelectorAll('h2, h3');
headings.forEach(heading => {
    heading.style.opacity = '0';
    heading.style.transform = 'translateY(20px)';
    heading.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(heading);
});

// Animate skill boxes
const skillElements = document.querySelectorAll('.skill');
skillElements.forEach(skill => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateY(20px)';
    skill.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
    observer.observe(skill);
});

// Animate project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    observer.observe(card);
});
