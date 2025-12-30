// UI Enhancements for Royal Score
// Adds subtle visual feedback and polish

// Add notification system
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.textContent = message;

    // Add styles
    const style = document.createElement('style');
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        style.textContent = `
            .notification-toast {
                position: fixed;
                top: 90px;
                right: 24px;
                background: rgba(0, 0, 0, 0.95);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 6px 24px rgba(0,0,0,0.4);
                z-index: 10000;
                animation: slideInRight 0.4s ease, slideOutRight 0.4s ease 2.6s;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                border: 2px solid rgba(255, 215, 0, 0.4);
                backdrop-filter: blur(10px);
            }

            .notification-toast.success {
                border-color: #4CAF50;
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(69, 160, 73, 0.9));
            }

            .notification-toast.error {
                border-color: #f44336;
                background: linear-gradient(135deg, rgba(244, 67, 54, 0.9), rgba(211, 47, 47, 0.9));
            }

            .notification-toast.info {
                border-color: #2196F3;
                background: linear-gradient(135deg, rgba(33, 150, 243, 0.9), rgba(25, 118, 210, 0.9));
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            @media (max-width: 768px) {
                .notification-toast {
                    right: 16px;
                    left: 16px;
                    top: 80px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Enhanced button click feedback
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .btn, .start-btn, .game-btn, .doc-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: rippleEffect 0.6s ease-out;
            `;

            // Add ripple animation
            if (!document.querySelector('#ripple-styles')) {
                const rippleStyle = document.createElement('style');
                rippleStyle.id = 'ripple-styles';
                rippleStyle.textContent = `
                    @keyframes rippleEffect {
                        from {
                            transform: scale(0);
                            opacity: 1;
                        }
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(rippleStyle);
            }

            const existingRipple = this.querySelector('span[style*="rippleEffect"]');
            if (existingRipple) existingRipple.remove();

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add focus styles for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    document.querySelectorAll(focusableElements).forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid rgba(255, 215, 0, 0.5)';
            this.style.outlineOffset = '3px';
        });
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.showNotification = showNotification;
}
