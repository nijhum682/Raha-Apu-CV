/* 
   Rubaiya Raktin Raha - Personal Portfolio Interactivity Script
   Features: Connected Neural-Net Particles Canvas, 3D Photo Tilt, 
             Typing Effect, Project Filtering, AJAX Form Transmissions.
*/

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Navigation & Mobile Menu Toggle
    // -------------------------------------------------------------
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Toggle menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Hamburger animation
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Scroll styles and Active section highlights
    window.addEventListener('scroll', () => {
        // Sticky Header styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active section link highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Visible Back-to-top button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    // -------------------------------------------------------------
    // 2. Typing Animation (Hero Section)
    // -------------------------------------------------------------
    const typingSpan = document.getElementById('home-typing');
    if (typingSpan) {
        const roles = [
            "Lecturer at Southeast University",
            "Research Assistant at UIU",
            "AI and ML Research Enthusiast"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 60;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                typingSpan.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 30; // Delete faster
            } else {
                typingSpan.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 65; // Natural type speed
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 1200; // Pause at completion
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 350; // Pause before typing next role
            }

            setTimeout(typeEffect, typingSpeed);
        }
        setTimeout(typeEffect, 600);
    }

    // -------------------------------------------------------------
    // 3. Interactive Neural Network Canvas Background
    // -------------------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let nodes = [];
        const maxNodes = window.innerWidth < 768 ? 35 : 75;
        const lineDistance = 135;
        let mouse = { x: null, y: null };

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initNodes();
        }

        class Node {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.radius = Math.random() * 2 + 1.2;
                this.pulsePhase = Math.random() * Math.PI;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulsePhase += 0.02;

                // Bounce off viewport boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                // Subtly pulsing node size/opacity
                const scale = 1 + Math.sin(this.pulsePhase) * 0.2;
                ctx.arc(this.x, this.y, this.radius * scale, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(13, 148, 136, 0.45)';
                ctx.fill();
            }
        }

        function initNodes() {
            nodes = [];
            for (let i = 0; i < maxNodes; i++) {
                nodes.push(new Node());
            }
        }

        function drawConnections() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < lineDistance) {
                        const alpha = (1 - (dist / lineDistance)) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        // Learning Signal Pulse effect along some random lines
                        if (Math.random() < 0.0001) {
                            drawPulseAlongLine(nodes[i], nodes[j]);
                        }
                    }
                }

                // Interactive connection to user cursor
                if (mouse.x !== null && mouse.y !== null) {
                    const mdx = nodes[i].x - mouse.x;
                    const mdy = nodes[i].y - mouse.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdist < 170) {
                        const alpha = (1 - (mdist / 170)) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(5, 150, 105, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }
        }

        // Draw a quick pulsing signal traveling along connection
        function drawPulseAlongLine(nodeA, nodeB) {
            ctx.beginPath();
            const grad = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
            grad.addColorStop(0, 'rgba(236, 72, 153, 0)');
            grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.8)');
            grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            nodes.forEach(node => {
                node.update();
                node.draw();
            });

            drawConnections();
            requestAnimationFrame(animateCanvas);
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resizeCanvas();
        animateCanvas();
    }

    // -------------------------------------------------------------
    // 4. Interactive 3D Photo Tilt & Glow Tracking
    // -------------------------------------------------------------
    const interactiveWrapper = document.getElementById('interactive-frame-wrapper');
    if (interactiveWrapper) {
        interactiveWrapper.addEventListener('mousemove', (e) => {
            const rect = interactiveWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const pctX = (x / rect.width * 100).toFixed(2) + '%';
            const pctY = (y / rect.height * 100).toFixed(2) + '%';
            
            // Calculate tilt: max tilt angle is 10 degrees
            const maxTilt = 10;
            const tiltX = (-(y / rect.height - 0.5) * maxTilt).toFixed(2) + 'deg';
            const tiltY = ((x / rect.width - 0.5) * maxTilt).toFixed(2) + 'deg';
            
            interactiveWrapper.style.setProperty('--mouse-x', pctX);
            interactiveWrapper.style.setProperty('--mouse-y', pctY);
            interactiveWrapper.style.setProperty('--tilt-x', tiltX);
            interactiveWrapper.style.setProperty('--tilt-y', tiltY);
        });
        
        interactiveWrapper.addEventListener('mouseleave', () => {
            interactiveWrapper.style.setProperty('--mouse-x', '50%');
            interactiveWrapper.style.setProperty('--mouse-y', '50%');
            interactiveWrapper.style.setProperty('--tilt-x', '0deg');
            interactiveWrapper.style.setProperty('--tilt-y', '0deg');
        });
    }

    // -------------------------------------------------------------
    // 5. Projects Category Filtering System
    // -------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active button swap
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    if (card.classList.contains(filterValue)) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 6. Form Submission & AJAX Custom Toast Notifications
    // -------------------------------------------------------------
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            // Simple email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showToast("Please enter a valid email address.", "error");
                return;
            }

            if (!name || !subject || !message) {
                showToast("Please fill in all input fields.", "error");
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Submit using FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/rubaiyaraktinraha@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    _subject: `New Academic Inquiry: ${subject}`,
                    message: message
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Message transmission failure.');
                }
            })
            .then(data => {
                showToast(`Message sent successfully. Thank you ${name}!`, 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error("AJAX Error:", error);
                showToast('Failed to send message. Please try again later.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // Custom Toast Notification System
    function showToast(message, type = 'success') {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        }

        toast.innerHTML = `
            ${iconSvg}
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        // Slide out and remove toast after timer
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
            setTimeout(() => {
                toast.remove();
                if (toastContainer.children.length === 0) {
                    toastContainer.remove();
                }
            }, 350);
        }, 3800);
    }
});

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
