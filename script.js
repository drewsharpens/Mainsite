// EmailJS Configuration - Replace with your actual EmailJS credentials
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID',  // Replace with your EmailJS template ID
    userId: 'YOUR_USER_ID'           // Replace with your EmailJS user ID
};

// Initialize EmailJS
document.addEventListener('DOMContentLoaded', function() {
    emailjs.init(EMAILJS_CONFIG.userId);
    
    // Initialize all functionality
    initSmoothScrolling();
    initContactForm();
    initScrollEffects();
    initNavigation();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .cta-button[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Account for fixed nav
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Contact form handling with EmailJS
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            showFormStatus('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Disable submit button
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Prepare form data
        const formData = {
            from_name: form.name.value,
            from_email: form.email.value,
            phone: form.phone.value,
            items: form.items.value,
            return_address: form.address.value,
            message: form.message.value,
            to_name: 'Drew', // Your name
        };
        
        // Send email via EmailJS
        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, formData)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                showFormStatus('Thank you! Your inquiry has been sent successfully. I\'ll get back to you soon!', 'success');
                form.reset();
            })
            .catch(function(error) {
                console.error('Email send failed:', error);
                showFormStatus('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
            })
            .finally(function() {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
}

// Form validation
function validateForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = ['name', 'email', 'items', 'address'];
    let isValid = true;
    
    // Clear previous error styling
    form.querySelectorAll('input, textarea').forEach(field => {
        field.style.borderColor = '';
    });
    
    requiredFields.forEach(fieldName => {
        const field = form[fieldName];
        if (!field.value.trim()) {
            field.style.borderColor = '#f87171';
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = form.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.style.borderColor = '#f87171';
        isValid = false;
    }
    
    return isValid;
}

// Show form status message
function showFormStatus(message, type) {
    const statusDiv = document.getElementById('form-status');
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// Navigation background on scroll
function initNavigation() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(248, 250, 252, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(44, 76, 122, 0.08)';
        } else {
            nav.style.background = 'rgba(248, 250, 252, 0.95)';
            nav.style.boxShadow = 'none';
        }
    });
}

// Scroll effects for animations
function initScrollEffects() {
    // Intersection Observer for animation triggers
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll(
        '.service-card, .skill-item, .step, .gallery-item, .contact-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect for hero section (subtle)
function initParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (!heroBackground) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${parallax}px)`;
    });
}

// Add loading states for better UX
function addLoadingStates() {
    // Add loading class to body until everything is loaded
    document.body.classList.add('loading');
    
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
        
        // Trigger hero animations
        const heroElements = document.querySelectorAll('.title-line, .hero-subtitle, .hero-cta, .hero-image');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationPlayState = 'running';
            }, index * 200);
        });
    });
}

// Initialize loading states
addLoadingStates();

// Utility function to throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth hover effects for interactive elements
function initHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .submit-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .cta-button, .submit-btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Initialize hover effects
initHoverEffects();

// Add keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes any modals or resets form
        if (e.key === 'Escape') {
            const statusDiv = document.getElementById('form-status');
            if (statusDiv && statusDiv.style.display !== 'none') {
                statusDiv.style.display = 'none';
            }
        }
        
        // Enter key on navigation links
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('nav-link')) {
                focusedElement.click();
            }
        }
    });
}

initKeyboardNavigation();

// Console message for development
console.log('🔪 DrewSharpens website loaded successfully!');
console.log('📧 Remember to configure EmailJS with your credentials in the EMAILJS_CONFIG object.');
console.log('🛠️ Replace YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, and YOUR_USER_ID with actual EmailJS values.');

/*
EmailJS Setup Instructions:
1. Go to https://www.emailjs.com/ and create a free account
2. Create a new service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - {{from_name}} - Customer name
   - {{from_email}} - Customer email
   - {{phone}} - Phone number
   - {{items}} - Items to sharpen
   - {{return_address}} - Return shipping address
   - {{message}} - Additional message
   - {{to_name}} - Your name (Drew)
4. Get your Service ID, Template ID, and User ID
5. Replace the placeholder values in EMAILJS_CONFIG above
6. Test the contact form!

Example EmailJS template:
Subject: New Sharpening Inquiry from {{from_name}}

Hi {{to_name}},

You have received a new inquiry from your website:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Items to sharpen:
{{items}}

Return address:
{{return_address}}

Additional message:
{{message}}

Reply to this email to respond directly to the customer.

Best regards,
Your Website
*/