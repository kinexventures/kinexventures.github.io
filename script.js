// Enhanced Security & Performance Script for Kinex Ventures
'use strict';

// Security: Prevent global variable pollution
(function() {
    // ===== Security Configurations =====
    const SECURITY_CONFIG = {
        maxFormSubmissions: 5,
        submissionWindow: 300000, // 5 minutes
        maxContentLength: 5000,
        blockedPatterns: [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi,
            /vbscript:/gi
        ]
    };

    // Track form submissions for rate limiting
    let formSubmissions = [];

    // ===== Utility Functions =====
    
    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - User input string
     * @returns {string} - Sanitized string
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        let sanitized = input;
        SECURITY_CONFIG.blockedPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });
        
        // Additional HTML entity encoding
        sanitized = sanitized
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
            
        return sanitized.substring(0, SECURITY_CONFIG.maxContentLength);
    }

    /**
     * Rate limiting for form submissions
     * @returns {boolean} - Whether submission is allowed
     */
    function checkRateLimit() {
        const now = Date.now();
        
        // Clean old submissions
        formSubmissions = formSubmissions.filter(
            time => now - time < SECURITY_CONFIG.submissionWindow
        );
        
        // Check if limit exceeded
        if (formSubmissions.length >= SECURITY_CONFIG.maxFormSubmissions) {
            console.warn('Form submission rate limit exceeded');
            return false;
        }
        
        formSubmissions.push(now);
        return true;
    }

    /**
     * Secure event listener attachment
     * @param {Element} element - DOM element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    function secureAddEventListener(element, event, handler) {
        if (!element || typeof handler !== 'function') return;
        
        element.addEventListener(event, function(e) {
            try {
                handler.call(this, e);
            } catch (error) {
                console.error('Event handler error:', error);
            }
        });
    }

    // ===== Performance Monitoring =====
    
    /**
     * Performance observer for monitoring page performance
     */
    function initPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        // Track page load performance
                        const loadTime = entry.loadEventEnd - entry.loadEventStart;
                        if (loadTime > 3000) { // Log slow loads
                            console.warn('Slow page load detected:', loadTime + 'ms');
                        }
                    }
                }
            });
            
            try {
                observer.observe({ entryTypes: ['navigation', 'paint'] });
            } catch (e) {
                console.log('Performance monitoring not available');
            }
        }
    }

    // ===== Navigation Enhancement =====
    
    /**
     * Enhanced navigation highlighting with security checks
     */
    function initNavigation() {
        const links = document.querySelectorAll("nav a");
        const currentPath = window.location.pathname;
        
        links.forEach(link => {
            try {
                const linkPath = new URL(link.href).pathname;
                
                // Security: Validate URL is from same origin
                if (new URL(link.href).origin !== window.location.origin) {
                    link.setAttribute('rel', 'noopener noreferrer');
                    link.setAttribute('target', '_blank');
                }
                
                // Highlight current page
                if (linkPath === currentPath || 
                    (currentPath === '/' && link.href.includes('index.html'))) {
                    link.classList.add("active");
                    link.setAttribute('aria-current', 'page');
                }
            } catch (error) {
                console.warn('Invalid link detected:', link.href);
            }
        });
    }

    /**
     * Mobile menu functionality with accessibility
     */
    function initMobileMenu() {
        const header = document.querySelector('header');
        if (!header) return;

        // Create mobile menu toggle if it doesn't exist
        let mobileToggle = header.querySelector('.mobile-menu-toggle');
        if (!mobileToggle) {
            mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-menu-toggle';
            mobileToggle.innerHTML = '☰';
            mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
            mobileToggle.setAttribute('aria-expanded', 'false');
            
            const nav = header.querySelector('nav');
            if (nav) {
                header.insertBefore(mobileToggle, nav);
            }
        }

        const navMenu = header.querySelector('nav ul');
        if (!navMenu) return;

        secureAddEventListener(mobileToggle, 'click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            navMenu.classList.toggle('show');
            this.setAttribute('aria-expanded', !isExpanded);
            this.innerHTML = isExpanded ? '☰' : '✕';
        });

        // Close menu when clicking outside
        secureAddEventListener(document, 'click', function(e) {
            if (!header.contains(e.target) && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '☰';
            }
        });
    }

    // ===== Smooth Scrolling with Security =====
    
    /**
     * Secure smooth scrolling for internal links
     */
    function initSmoothScrolling() {
        const smoothLinks = document.querySelectorAll('a[href^="#"]');
        
        smoothLinks.forEach(anchor => {
            secureAddEventListener(anchor, "click", function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute("href");
                
                // Security: Validate target ID
                if (!/^#[a-zA-Z0-9_-]+$/.test(targetId)) {
                    console.warn('Invalid anchor target:', targetId);
                    return;
                }
                
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    
                    // Update URL without triggering navigation
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    }

    // ===== Form Security Enhancement =====
    
    /**
     * Enhanced form security and validation
     */
    function initFormSecurity() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add CSRF token if not present
            if (!form.querySelector('input[name="csrf_token"]')) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = generateCSRFToken();
                form.appendChild(csrfInput);
            }

            // Secure form submission
            secureAddEventListener(form, 'submit', function(e) {
                if (!checkRateLimit()) {
                    e.preventDefault();
                    showMessage('Too many submissions. Please wait before trying again.', 'error');
                    return;
                }

                // Sanitize all text inputs
                const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
                textInputs.forEach(input => {
                    input.value = sanitizeInput(input.value);
                });
            });

            // Real-time input sanitization
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                secureAddEventListener(input, 'blur', function() {
                    if (this.type === 'text' || this.type === 'email' || this.tagName === 'TEXTAREA') {
                        this.value = sanitizeInput(this.value);
                    }
                });
            });
        });
    }

    /**
     * Generate a simple CSRF token (client-side placeholder)
     * Note: In production, this should be generated server-side
     */
    function generateCSRFToken() {
        return 'csrf_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // ===== Accessibility Enhancements =====
    
    /**
     * Accessibility improvements
     */
    function initAccessibility() {
        // Skip link for keyboard navigation
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.className = 'skip-link sr-only';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: absolute;
                left: -9999px;
                z-index: 999999;
                padding: 8px 16px;
                background: #000;
                color: #fff;
                text-decoration: none;
            `;
            
            secureAddEventListener(skipLink, 'focus', function() {
                this.style.left = '6px';
                this.style.top = '7px';
            });
            
            secureAddEventListener(skipLink, 'blur', function() {
                this.style.left = '-9999px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Add main landmark if missing
        if (!document.querySelector('main')) {
            const sections = document.querySelectorAll('.section');
            if (sections.length > 0) {
                const main = document.createElement('main');
                main.id = 'main';
                sections[0].parentNode.insertBefore(main, sections[0]);
                sections.forEach(section => main.appendChild(section));
            }
        }

        // Enhance focus management
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // ===== Animation on Scroll =====
    
    /**
     * Intersection Observer for scroll animations
     */
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const animateElements = document.querySelectorAll('.card, .section > h2, .section > p');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll', 'visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(element => {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    }

    // ===== Error Handling =====
    
    /**
     * Global error handler
     */
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('JavaScript error:', e.error);
            
            // Don't expose errors to users in production
            if (location.hostname !== 'localhost') {
                return;
            }
        });

        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    // ===== Message Display System =====
    
    /**
     * Display user messages securely
     * @param {string} message - Message to display
     * @param {string} type - Message type (success, error, warning, info)
     */
    function showMessage(message, type = 'info') {
        const sanitizedMessage = sanitizeInput(message);
        
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.user-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `user-message user-message-${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        // Set colors based on type
        const colors = {
            success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
            error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
            warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
            info: { bg: '#d1ecf1', color: '#0c5460', border: '#b6d4db' }
        };
        
        const style = colors[type] || colors.info;
        messageDiv.style.backgroundColor = style.bg;
        messageDiv.style.color = style.color;
        messageDiv.style.border = `1px solid ${style.border}`;
        
        messageDiv.textContent = sanitizedMessage;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: inherit;
        `;
        
        secureAddEventListener(closeBtn, 'click', () => messageDiv.remove());
        messageDiv.appendChild(closeBtn);
        
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // ===== SEO Enhancements =====
    
    /**
     * Dynamic SEO improvements
     */
    function initSEOEnhancements() {
        // Add structured data for breadcrumbs if not present
        if (!document.querySelector('script[type="application/ld+json"]')) {
            addBreadcrumbSchema();
        }
        
        // Optimize images with lazy loading
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
            
            // Add error handling for images
            secureAddEventListener(img, 'error', function() {
                this.style.display = 'none';
                console.warn('Failed to load image:', this.src);
            });
        });
        
        // Add meta refresh for outdated browsers
        if (!document.querySelector('meta[http-equiv="refresh"]')) {
            const refreshMeta = document.createElement('meta');
            refreshMeta.setAttribute('http-equiv', 'refresh');
            refreshMeta.setAttribute('content', '1800'); // 30 minutes
            document.head.appendChild(refreshMeta);
        }
    }

    /**
     * Add breadcrumb structured data
     */
    function addBreadcrumbSchema() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part);
        
        if (pathParts.length === 0) return;
        
        const breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": window.location.origin
                }
            ]
        };
        
        pathParts.forEach((part, index) => {
            const name = part.replace('.html', '').replace('-', ' ');
            const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
            
            breadcrumbs.itemListElement.push({
                "@type": "ListItem",
                "position": index + 2,
                "name": capitalizedName,
                "item": `${window.location.origin}/${pathParts.slice(0, index + 1).join('/')}`
            });
        });
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbs);
        document.head.appendChild(script);
    }

    // ===== Analytics Integration =====
    
    /**
     * Privacy-focused analytics tracking
     */
    function initAnalytics() {
        // Track page views
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
        
        // Track outbound links
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        externalLinks.forEach(link => {
            secureAddEventListener(link, 'click', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'outbound',
                        event_label: this.href
                    });
                }
            });
        });
        
        // Track scroll depth
        let maxScroll = 0;
        secureAddEventListener(window, 'scroll', function() {
            const scrolled = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrolled > maxScroll) {
                maxScroll = Math.min(scrolled, 100);
                
                if (maxScroll >= 25 && maxScroll < 50 && typeof gtag !== 'undefined') {
                    gtag('event', 'scroll', { event_category: 'engagement', event_label: '25%' });
                } else if (maxScroll >= 50 && maxScroll < 75) {
                    gtag('event', 'scroll', { event_category: 'engagement', event_label: '50%' });
                } else if (maxScroll >= 75) {
                    gtag('event', 'scroll', { event_category: 'engagement', event_label: '75%' });
                }
            }
        });
    }

    // ===== Security Headers Check =====
    
    /**
     * Check for security headers (development tool)
     */
    function checkSecurityHeaders() {
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            console.log('🔒 Security Headers Check:');
            
            const headers = {
                'Content-Security-Policy': 'CSP header protects against XSS attacks',
                'X-Frame-Options': 'Prevents clickjacking attacks',
                'X-Content-Type-Options': 'Prevents MIME type sniffing',
                'Referrer-Policy': 'Controls referrer information',
                'X-XSS-Protection': 'Enables XSS filtering'
            };
            
            Object.keys(headers).forEach(header => {
                console.log(`${header}: ${headers[header]}`);
            });
            
            console.log('✅ Make sure these headers are set on your server!');
        }
    }

    // ===== Initialization =====
    
    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        // Core functionality
        initNavigation();
        initMobileMenu();
        initSmoothScrolling();
        initFormSecurity();
        initAccessibility();
        
        // Enhanced features
        initScrollAnimations();
        initSEOEnhancements();
        initAnalytics();
        initPerformanceMonitoring();
        initErrorHandling();
        
        // Development tools
        checkSecurityHeaders();
        
        console.log('🚀 Kinex Ventures website initialized with security and SEO optimizations');
    }

    // ===== Event Listeners =====
    
    // DOM Content Loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Page Visibility API for analytics
    if ('visibilityState' in document) {
        secureAddEventListener(document, 'visibilitychange', function() {
            if (document.visibilityState === 'hidden' && typeof gtag !== 'undefined') {
                gtag('event', 'page_visibility', {
                    event_category: 'engagement',
                    event_label: 'hidden'
                });
            }
        });
    }
    
    // Expose safe public methods
    window.KinexVentures = {
        showMessage: showMessage,
        sanitizeInput: sanitizeInput
    };

})(); // End of IIFE

// ===== Service Worker Registration (Progressive Web App) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
