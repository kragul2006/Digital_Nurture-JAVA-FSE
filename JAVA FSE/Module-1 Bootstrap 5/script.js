/**
 * Bootstrap5 Community Event Portal — Custom JavaScript
 * script.js
 * Author: Community Portal Team
 *
 * Modules:
 *   1. DOM Ready Init
 *   2. Registration Form Validation
 *   3. Back-To-Top Button
 *   4. Scroll Reveal Animation
 *   5. Navbar Active Link (Scrollspy helper)
 *   6. Navbar Shrink on Scroll
 *   7. Toast Notification Helper
 *   8. Search Input Handler
 *   9. Filter Button (Sidebar)
 *  10. Newsletter Subscription Handler
 *  11. Carousel Auto-Play Control
 *  12. Smooth Accordion Animation Helper
 *  13. Card Hover Sound (visual feedback only – no audio)
 *  14. Utility Functions
 */

'use strict';

/* ─────────────────────────────────────────────────
   1. DOM READY INIT
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFormValidation();
  initBackToTop();
  initScrollReveal();
  initNavbarShrink();
  initSearchHandler();
  initFilterHandler();
  initNewsletterHandlers();
  initCarouselPause();
  initTooltips();
  initPopovers();
  console.log('%c🎉 Community Event Portal Loaded', 'color:#ffc107;font-size:14px;font-weight:bold;');
});


/* ─────────────────────────────────────────────────
   2. REGISTRATION FORM VALIDATION
   Uses Bootstrap 5 custom validation
───────────────────────────────────────────────── */
function initFormValidation() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Add Bootstrap validation classes
    form.classList.add('was-validated');

    if (form.checkValidity()) {
      // Simulate async submission
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing…';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Complete Registration';

        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        // Reset form
        form.reset();
        form.classList.remove('was-validated');

        // Show success toast
        showToast('Registration Successful!', 'Your spot has been confirmed. Check your email.', 'success');
      }, 1800);

    } else {
      // Scroll to first invalid field
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      showToast('Incomplete Form', 'Please fill in all required fields correctly.', 'danger');
    }
  });

  // Real-time feedback for email field
  const emailField = document.getElementById('emailAddress');
  if (emailField) {
    emailField.addEventListener('input', () => {
      const isValid = emailField.validity.valid;
      emailField.classList.toggle('is-valid', isValid && emailField.value.length > 0);
      emailField.classList.toggle('is-invalid', !isValid && emailField.value.length > 0);
    });
  }

  // Real-time feedback for name field
  const nameField = document.getElementById('fullName');
  if (nameField) {
    nameField.addEventListener('input', () => {
      const isValid = nameField.validity.valid;
      nameField.classList.toggle('is-valid', isValid);
      nameField.classList.toggle('is-invalid', !isValid && nameField.value.length > 0);
    });
  }
}


/* ─────────────────────────────────────────────────
   3. BACK-TO-TOP BUTTON
───────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
      btn.style.display = 'flex';
    } else {
      btn.classList.remove('visible');
    }
  }, 100));

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ─────────────────────────────────────────────────
   4. SCROLL REVEAL ANIMATION
   Adds .visible class when elements enter viewport
───────────────────────────────────────────────── */
function initScrollReveal() {
  // Add .reveal to targeted elements
  const targets = document.querySelectorAll(
    '.event-card, .feature-box, .contact-card, .sidebar-widget, .accordion-item'
  );

  targets.forEach((el) => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}


/* ─────────────────────────────────────────────────
   5. NAVBAR SHRINK ON SCROLL
───────────────────────────────────────────────── */
function initNavbarShrink() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 60) {
      navbar.classList.add('navbar-shrunk');
      navbar.style.padding = '0.3rem 0';
    } else {
      navbar.classList.remove('navbar-shrunk');
      navbar.style.padding = '';
    }
  }, 100));
}


/* ─────────────────────────────────────────────────
   6. TOAST NOTIFICATION HELPER
───────────────────────────────────────────────── */
function showToast(title, message, type = 'primary') {
  // Create toast container if missing
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '11000';
    document.body.appendChild(container);
  }

  // Build toast element
  const id = 'toast-' + Date.now();
  const iconMap = {
    success: 'bi-check-circle-fill text-success',
    danger:  'bi-exclamation-circle-fill text-danger',
    warning: 'bi-exclamation-triangle-fill text-warning',
    primary: 'bi-info-circle-fill text-primary',
    info:    'bi-info-circle-fill text-info',
  };
  const icon = iconMap[type] || iconMap.primary;

  const toastEl = document.createElement('div');
  toastEl.id = id;
  toastEl.className = 'toast align-items-center border-0 shadow-lg rounded-3';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="toast-header border-0">
      <i class="bi ${icon} me-2 fs-6"></i>
      <strong class="me-auto">${escapeHTML(title)}</strong>
      <small class="text-muted">now</small>
      <button type="button" class="btn-close ms-2" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body text-muted small">
      ${escapeHTML(message)}
    </div>
  `;

  container.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();

  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}


/* ─────────────────────────────────────────────────
   7. SEARCH HANDLER
───────────────────────────────────────────────── */
function initSearchHandler() {
  const searchForms = document.querySelectorAll('form[role="search"]');

  searchForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="search"]');
      const query = input ? input.value.trim() : '';

      if (query.length < 2) {
        showToast('Search', 'Please enter at least 2 characters to search.', 'warning');
        return;
      }

      showToast('Searching…', `Finding events matching "${query}"`, 'primary');

      // Scroll to events section
      setTimeout(() => {
        const eventsSection = document.getElementById('events');
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (input) input.value = '';
      }, 800);
    });
  });
}


/* ─────────────────────────────────────────────────
   8. SIDEBAR FILTER HANDLER
───────────────────────────────────────────────── */
function initFilterHandler() {
  const filterBtn = document.querySelector('.sidebar-widget .btn-warning');
  if (!filterBtn) return;

  filterBtn.addEventListener('click', () => {
    const categoryEl = document.querySelector('.sidebar-widget select');
    const category = categoryEl ? categoryEl.value : 'All';

    filterBtn.disabled = true;
    filterBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Filtering…';

    setTimeout(() => {
      filterBtn.disabled = false;
      filterBtn.innerHTML = 'Apply Filters';
      showToast('Filters Applied', `Showing results for: ${category}`, 'success');
    }, 1000);
  });
}


/* ─────────────────────────────────────────────────
   9. NEWSLETTER SUBSCRIPTION HANDLERS
───────────────────────────────────────────────── */
function initNewsletterHandlers() {
  // Find all newsletter subscribe buttons (strip section + footer)
  const subscribeButtons = document.querySelectorAll(
    'section.py-5.bg-warning .btn-dark, footer .input-group .btn-warning'
  );

  subscribeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const inputGroup = btn.closest('.input-group');
      if (!inputGroup) return;

      const emailInput = inputGroup.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email || !isValidEmail(email)) {
        showToast('Invalid Email', 'Please enter a valid email address.', 'warning');
        if (emailInput) emailInput.focus();
        return;
      }

      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        if (emailInput) emailInput.value = '';
        showToast('Subscribed! 🎉', `${email} has been added to our mailing list.`, 'success');
      }, 1200);
    });
  });
}


/* ─────────────────────────────────────────────────
   10. CAROUSEL PAUSE ON HOVER
───────────────────────────────────────────────── */
function initCarouselPause() {
  const carouselEl = document.getElementById('galleryCarousel');
  if (!carouselEl) return;

  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
    interval: 4000,
    ride: 'carousel',
    wrap: true,
  });

  carouselEl.addEventListener('mouseenter', () => carousel.pause());
  carouselEl.addEventListener('mouseleave', () => carousel.cycle());

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const rect = carouselEl.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft')  carousel.prev();
    if (e.key === 'ArrowRight') carousel.next();
  });
}


/* ─────────────────────────────────────────────────
   11. BOOTSTRAP TOOLTIPS INIT
───────────────────────────────────────────────── */
function initTooltips() {
  const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipEls.forEach((el) => new bootstrap.Tooltip(el));
}


/* ─────────────────────────────────────────────────
   12. BOOTSTRAP POPOVERS INIT
───────────────────────────────────────────────── */
function initPopovers() {
  const popoverEls = document.querySelectorAll('[data-bs-toggle="popover"]');
  popoverEls.forEach((el) => new bootstrap.Popover(el, { trigger: 'hover focus' }));
}


/* ─────────────────────────────────────────────────
   13. COLLAPSE CHEVRON TOGGLE
   Animates the chevron icon on collapse toggles
───────────────────────────────────────────────── */
document.addEventListener('show.bs.collapse', (e) => {
  const id = e.target.id;
  const trigger = document.querySelector(`[data-bs-target="#${id}"] i.bi-chevron-down`);
  if (trigger) trigger.style.transform = 'rotate(180deg)';
});

document.addEventListener('hide.bs.collapse', (e) => {
  const id = e.target.id;
  const trigger = document.querySelector(`[data-bs-target="#${id}"] i.bi-chevron-down`);
  if (trigger) trigger.style.transform = 'rotate(0deg)';
});

// Smooth chevron transition
document.querySelectorAll('[data-bs-toggle="collapse"] i.bi-chevron-down').forEach((icon) => {
  icon.style.transition = 'transform 0.3s ease';
});


/* ─────────────────────────────────────────────────
   14. ACTIVE NAV LINK HIGHLIGHT (Scrollspy Supplement)
───────────────────────────────────────────────── */
window.addEventListener('scroll', throttle(() => {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('#mainNavbar .nav-link[href^="#"]');
  const scrollPos = window.scrollY + 100;

  let current = '';
  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, 120));


/* ─────────────────────────────────────────────────
   15. UTILITY: THROTTLE
───────────────────────────────────────────────── */
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}


/* ─────────────────────────────────────────────────
   16. UTILITY: SIMPLE EMAIL VALIDATION
───────────────────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ─────────────────────────────────────────────────
   17. UTILITY: ESCAPE HTML (XSS prevention)
───────────────────────────────────────────────── */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


/* ─────────────────────────────────────────────────
   18. MODAL EVENT: Reset on close
───────────────────────────────────────────────── */
const successModalEl = document.getElementById('successModal');
if (successModalEl) {
  successModalEl.addEventListener('hidden.bs.modal', () => {
    // Any cleanup after modal close
    console.log('Modal closed — ready for next registration.');
  });
}


/* ─────────────────────────────────────────────────
   19. REGISTER BUTTON CLICKS ON EVENT CARDS
   Populate modal with event name if needed
───────────────────────────────────────────────── */
document.querySelectorAll('.event-card .btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const cardTitle = btn.closest('.card').querySelector('.card-title');
    if (cardTitle) {
      // Pre-fill event category in form based on clicked card
      const badge = btn.closest('.card').querySelector('.badge:not(.notification-dot)');
      if (badge) {
        const categoryText = badge.textContent.trim().toLowerCase();
        const categoryMap = {
          music:    'music',
          tech:     'tech',
          food:     'food',
          arts:     'art',
          wellness: 'wellness',
          lit:      'literature',
        };
        const selectEl = document.getElementById('eventCategory');
        if (selectEl) {
          for (const [key, val] of Object.entries(categoryMap)) {
            if (categoryText.includes(key)) {
              selectEl.value = val;
              break;
            }
          }
        }
      }
    }
  });
});


/* ─────────────────────────────────────────────────
   20. PAGE LOAD PERFORMANCE LOG
───────────────────────────────────────────────── */
window.addEventListener('load', () => {
  if (window.performance) {
    const loadTime = (performance.now() / 1000).toFixed(2);
    console.log(`%c⚡ Page fully loaded in ${loadTime}s`, 'color:#28a745;font-size:12px;');
  }
});
